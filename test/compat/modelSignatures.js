/* global after, before, describe, it */

'use strict';

var test = require('unit.js');
var expect = require('expect');
var mock = require('./mock');
var sample, instance;

describe('1.2 model signatures', function () {
  before(function (done) {
    mock.petstore(done, function (petstore, server){
      sample = petstore;
      instance = server;
    });
  });

  after(function (done){
    instance.close();
    done();
  });

  it('returns the json representation of a pet with repeating models', function () {
    var pet = sample.models.Animals;

    test.object(pet);

    // verify that each instance of `Pet` is represented
    var petModel = '{"id":0,"category":{"id":0,"name":""},"name":"","photoUrls":[""],"tags":[{"id":0,"name":""}],"status":"","phone":{"code":"","number":""},"owner":{"name":"","phone":{"code":"","number":""}}}';
    var model = '';

    model += '{' + '"cat":' + petModel + ',';
    model += '"dog":' + petModel + ',';
    model += '"mouse":' + petModel + '}';

    // TODO: enable with issue https://github.com/swagger-api/swagger-js/issues/306
    // expect(JSON.stringify(pet.createJSONSample())).toBe(model);
  });
});
