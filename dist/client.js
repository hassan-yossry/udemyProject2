"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var result = dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
if (result.error) {
    throw Error("No config");
}
var _a = process.env, ENV = _a.ENV, PG_HOST = _a.PG_HOST, PG_USER = _a.PG_USER, PG_PASSWORD = _a.PG_PASSWORD, PG_DB = _a.PG_DB, PG_TEST = _a.PG_TEST;
var client;
if (ENV === "dev") {
    client = new pg_1.Pool({
        host: PG_HOST,
        password: PG_PASSWORD,
        user: PG_USER,
        database: PG_DB
    });
}
else {
    client = new pg_1.Pool({
        host: PG_HOST,
        password: PG_PASSWORD,
        user: PG_USER,
        database: PG_TEST
    });
}
exports.default = client;
