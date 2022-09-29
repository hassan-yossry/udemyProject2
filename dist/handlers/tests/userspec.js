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
var supertest_1 = __importDefault(require("supertest"));
var client_1 = __importDefault(require("../../client"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var process_1 = __importDefault(require("process"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var user_1 = __importDefault(require("../user"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
var server = app.listen(3002, function () { console.log('listening ....'); });
(0, user_1.default)(app);
var req = (0, supertest_1.default)(app);
var insertUser = function (first_name, last_name, pass) { return __awaiter(void 0, void 0, void 0, function () {
    var saltings, pepper, hash, conn, result, user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltings = '10';
                pepper = 'this is default';
                if (process_1.default.env.SECRET_KEY)
                    pepper = process_1.default.env.SECRET_KEY;
                if (process_1.default.env.SALTING_ROUNDS)
                    saltings = process_1.default.env.SALTING_ROUNDS + '';
                hash = bcrypt_1.default.hashSync(pass + pepper, parseInt(saltings));
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING *', [first_name, last_name, hash])];
            case 2:
                result = _a.sent();
                user = result.rows[0];
                conn.release();
                if (process_1.default.env.TOKEN_SECRET) {
                    token = jsonwebtoken_1.default.sign({
                        id: parseInt(result.rows[0].id),
                        first_name: 'hassan',
                        last_name: 'yossry'
                    }, process_1.default.env.TOKEN_SECRET);
                    return [2 /*return*/, { user: user, token: token }];
                }
                else {
                    throw new Error('Token secret not provided');
                }
                return [2 /*return*/];
        }
    });
}); };
describe("Testing users handlers", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    }); });
    it('Login api point', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'sus')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, req.post('/users/login').send({ "first_name": "hassan", "last_name": "yossry", "password": "sus" })];
                case 2:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body.token).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Login api point error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, req.post('/users/login').send({ "first_name": "hassan", "last_name": "yossry", "password": "suss" })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.token).not.toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('create user Api', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    token = (_a.sent()).token;
                    return [4 /*yield*/, req.post('/users').send({ 'first_name': 'toqa', "last_name": "hossam", "password": "pass123" })];
                case 2:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.token).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('index users API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user1, token, user2, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    _a = _b.sent(), user1 = _a.user, token = _a.token;
                    return [4 /*yield*/, insertUser('toqa', 'hossam', 'pass123')];
                case 2:
                    user2 = (_b.sent()).user;
                    return [4 /*yield*/, req.get('/users').set('Authorization', "bearer ".concat(token))];
                case 3:
                    res = _b.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body).toEqual([user1, user2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('show user API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, token, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    _a = _b.sent(), user = _a.user, token = _a.token;
                    return [4 /*yield*/, req.get("/users/".concat(user.id)).set('Authorization', "bearer ".concat(token))];
                case 2:
                    res = _b.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(user);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Delete user API', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, token, conn, res1, res, res2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    _a = _b.sent(), user = _a.user, token = _a.token;
                    return [4 /*yield*/, client_1.default.connect()];
                case 2:
                    conn = _b.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM users WHERE id = $1', [parseInt(user.id)])];
                case 3:
                    res1 = _b.sent();
                    expect(res1.rowCount).toBe(1);
                    return [4 /*yield*/, req.delete('/users').set('Authorization', "bearer ".concat(token)).send({ id: user.id })];
                case 4:
                    res = _b.sent();
                    expect(res.statusCode).toBe(200);
                    return [4 /*yield*/, conn.query('SELECT * FROM users WHERE id = $1', [parseInt(user.id)])];
                case 5:
                    res2 = _b.sent();
                    expect(res2.rowCount).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            server.close();
            return [2 /*return*/];
        });
    }); });
});
