'use strict';

describe('Service: io', function () {

  // load the service's module
  beforeEach(module('vuboruServerApp'));

  // instantiate service
  var io;
  beforeEach(inject(function (_io_) {
    io = _io_;
  }));

  it('should do something', function () {
    expect(!!io).toBe(true);
  });

});
