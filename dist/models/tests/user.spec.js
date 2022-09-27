"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../users");
var client_1 = __importDefault(require("../../client"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var encrypt_pass = function (password) {
    var saltings = '10';
    var pepper = 'this is default';
    if (process.env.SECRET_KEY)
        pepper = process.env.SECRET_KEY;
    if (process.env.SALTING_ROUNDS)
        saltings = process.env.SALTING_ROUNDS + '';
    var hash = bcrypt_1.default.hashSync(password + pepper, parseInt(saltings));
    return hash;
};
var insertUser = function (first_name, last_name, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, conn, result, user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hash = encrypt_pass(password);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING *', [first_name, last_name, hash])];
            case 2:
                result = _a.sent();
                user = result.rows[0];
                conn.release();
                if (process.env.TOKEN_SECRET) {
                    token = jsonwebtoken_1.default.sign({
                        id: parseInt(result.rows[0].id),
                        first_name: 'hassan',
                        last_name: 'yossry'
                    }, process.env.TOKEN_SECRET);
                    return [2 /*return*/, { user: user, token: token }];
                }
                else {
                    throw new Error('Token secret not provided');
                }
                return [2 /*return*/];
        }
    });
}); };
var manager = new users_1.User_Manager;
var prepare = function () { return __awaiter(void 0, void 0, void 0, function () {
    var conn, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('DELETE FROM order_products')];
            case 2:
                _a.sent();
                return [4 /*yield*/, conn.query('DELETE FROM orders')];
            case 3:
                _a.sent();
                return [4 /*yield*/, conn.query('DELETE FROM products')];
            case 4:
                _a.sent();
                return [4 /*yield*/, conn.query('DELETE FROM users')];
            case 5:
                _a.sent();
                conn.release();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                throw new Error("A prepare Error ".concat(err_1));
            case 7: return [2 /*return*/];
        }
    });
}); };
describe("Products testing", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect create to be defined", function () {
        expect(manager.create).toBeDefined();
    });
    it('Expect index to be defined', function () {
        expect(manager.index).toBeDefined();
    });
    it('Exepect show to be defined', function () {
        expect(manager.show).toBeDefined();
    });
    it('Exepect delete to be defined', function () {
        expect(manager.delete).toBeDefined();
    });
    it('Expect create user to create user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, conn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, manager.create({
                        id: 0,
                        first_name: "hassan",
                        last_name: "yossry",
                        password: "password123"
                    })];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 2:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM users WHERE id = $1', [user.id])];
                case 3:
                    result = _a.sent();
                    conn.release();
                    expect(result.rows[0]).toBeDefined();
                    expect(result.rows[0].id).toBe(user.id);
                    expect(result.rows[0].first_name).toBe(user.first_name);
                    expect(result.rows[0].last_name).toBe(user.last_name);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Expect index to produce an array of results', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertUser('toqa', 'hossam', 'pass456')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, manager.index()];
                case 4:
                    result = _a.sent();
                    expect(result.length).toBe(2);
                    expect(result[0].id).toBeDefined();
                    expect(result[0].first_name).toBeDefined();
                    expect(result[0].first_name).toBe('hassan');
                    expect(result[0].last_name).toBeDefined();
                    expect(result[0].last_name).toBe('yossry');
                    expect(result[0].password).toBeDefined();
                    expect(result[1].id).toBeDefined();
                    expect(result[1].first_name).toBeDefined();
                    expect(result[1].first_name).toBe('toqa');
                    expect(result[1].last_name).toBeDefined();
                    expect(result[1].last_name).toBe('hossam');
                    expect(result[1].password).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Expect show to retrieve user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, token, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 2:
                    _a = _b.sent(), user = _a.user, token = _a.token;
                    return [4 /*yield*/, manager.show(String(user.id))];
                case 3:
                    result = _b.sent();
                    expect(result.first_name).toBe('hassan');
                    expect(result.last_name).toBe('yossry');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Expect delete to re  user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, token, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 2:
                    _a = _b.sent(), user = _a.user, token = _a.token;
                    return [4 /*yield*/, manager.show(String(user.id))];
                case 3:
                    result = _b.sent();
                    expect(result.first_name).toBe('hassan');
                    expect(result.last_name).toBe('yossry');
                    return [2 /*return*/];
            }
        });
    }); });
});
