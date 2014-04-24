'use strict';

describe('Service: nop', function () {

  // load the service's module
  beforeEach(module('vuboruServerApp'));

  // instantiate service
  var nop;
  beforeEach(inject(function (_nop_) {
    nop = _nop_;
  }));

  it('should do something', function () {
    expect(!!nop).toBe(true);
  });

});
