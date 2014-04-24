module.exports = function (requestTime, schemaName, object) {
    object.authoredBy = "9b054320-64c7-a1bf-8ba0-ed3463b9e591"; // Or use auth cookie for the same purpose
    object.authoredOn = requestTime;

    return true; // The porcess can be conditional
}