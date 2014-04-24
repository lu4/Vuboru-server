'use strict';

describe('Service: Entities', function () {

  // load the service's module
  beforeEach(module('vuboruServerApp'));

  // instantiate service
  var Entities;
  beforeEach(inject(function (_Entities_) {
    Entities = _Entities_;
  }));

  it('should do something', function () {
    expect(!!Entities).toBe(true);
  });

});
