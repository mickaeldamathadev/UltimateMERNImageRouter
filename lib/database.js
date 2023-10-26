"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var conn = mongoose_1.default.createConnection(process.env.MONGO_URI || 'mongo://localhost:27017');
process.on('exit', function () {
    conn.close();
});
process.on('SIGINT', function () {
    conn.close().then(function () {
        process.exit(1);
    });
});
process.on('SIGTERM', function () {
    conn.close().then(function () {
        process.exit(1);
    });
});
process.on('SIGUSR1', function () {
    conn.close().then(function () {
        process.exit(1);
    });
});
process.on('SIGUSR2', function () {
    conn.close().then(function () {
        process.exit(1);
    });
});
