/* global describe, it */

'use strict';

var _ = require('lodash-compat');
var expect = require('expect');
var petstoreRaw = require('./spec/v2/petstore.json');
var SwaggerClient = require('..');

describe('SwaggerClient', function () {
  it('ensure externalDocs is attached to the client when available (Issue 276)', function (done) {
    var client = new SwaggerClient({
      spec: petstoreRaw,
      success: function () {
        expect(client.externalDocs).toEqual(petstoreRaw.externalDocs);

        done();
      }
    });
  });

  it('ensure reserved tag names are handled properly (Issue 209)', function (done) {
    var cPetStore = _.cloneDeep(petstoreRaw);

    cPetStore.tags[1].name = 'help';

    _.forEach(cPetStore.paths, function (path) {
      _.forEach(path, function (operation) {
        _.forEach(operation.tags, function (tag, index) {
          if (tag === 'user') {
            operation.tags[index] = 'help';
          }
        });
      });
    });

    var client = new SwaggerClient({
      spec: cPetStore,
      success: function () {
        expect(client.help).toBeA('function');
        expect(client.apis.help).toBeA('function');
        expect(client.pet.help).toBeA('function');
        expect(client._help.help).toBeA('function');

        expect(Object.keys(client.pet)).toEqual(Object.keys(client.apis.pet));
        expect(client._help).toEqual(client.apis._help);

        expect(client.help(true).indexOf('_help')).toBeMoreThan(-1);
        expect(client.apis.help(true).indexOf('_help')).toBeMoreThan(-1);
        expect(client._help.help(true).indexOf('_help')).toBeMoreThan(-1);
        expect(client.apis._help.help(true).indexOf('_help')).toBeMoreThan(-1);

        done();
      }
    });
  });

  it('ensure reserved operation names are handled properly (Issue 209)', function (done) {
    var cPetStore = _.cloneDeep(petstoreRaw);

    cPetStore.paths['/pet/add'].post.operationId = 'help';

    var client = new SwaggerClient({
      spec: cPetStore,
      success: function () {
        expect(client.pet.help).toBeA('function');
        expect(client.pet._help).toBeA('function');

        expect(client.help(true).indexOf('_help')).toBeMoreThan(-1);
        expect(client.pet.help(true).indexOf('_help')).toBeMoreThan(-1);
        expect(client.pet._help.help(true).indexOf('_help')).toBeMoreThan(-1);

        done();
      }
    });
  });

  it('should handle empty tags (Issue 291)', function (done) {
    var cPetStore = _.cloneDeep(petstoreRaw);

    cPetStore.paths['/pet/add'].post.tags = [];

    var client = new SwaggerClient({
      spec: cPetStore,
      success: function () {
        expect(client.default.help).toBeA('function');
        expect(client.default.createPet).toBeA('function');

        done();
      }
    });
  });
});
