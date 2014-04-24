var app;

exports.initialise = function (_app) {
    app = _app;

    return app;
};

exports.app = function () {
    return app;
};

exports.get = function (setting) {
    var result = app.get(setting);

    if (result) {
        return result;
    } else {
        throw new Error("Setting '" + setting + "' not found!");
    }
};

exports.set = function (setting, val) {
    app.set(setting, val);

    return val;
};
