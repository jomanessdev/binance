"use strict";
exports.__esModule = true;
var admin = require("firebase-admin");
var serviceAccount = require('../config/serviceAccountKey.json');
var FireBaseController = /** @class */ (function () {
    function FireBaseController() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://binance-c0c2d.firebaseio.com"
        });
        this.db = admin.database();
    }
    FireBaseController.prototype.pushToSpecificTable = function (tableName, _content, _timestamp) {
        return this.db.ref(tableName).push().set({ timestamp: _timestamp, content: _content });
    };
    return FireBaseController;
}());
exports.FireBaseController = FireBaseController;
