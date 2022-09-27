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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var product_1 = __importDefault(require("../product"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
var server = app.listen(3000, function () { console.log('listening ....'); });
(0, product_1.default)(app);
var req = (0, supertest_1.default)(app);
var insertUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var saltings, pepper, hash, conn, result, user_id, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltings = '10';
                pepper = 'this is default';
                if (process_1.default.env.SECRET_KEY)
                    pepper = process_1.default.env.SECRET_KEY;
                if (process_1.default.env.SALTING_ROUNDS)
                    saltings = process_1.default.env.SALTING_ROUNDS + '';
                hash = bcrypt_1.default.hashSync('sus' + pepper, parseInt(saltings));
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING id', ['hassan', 'yossry', hash])];
            case 2:
                result = _a.sent();
                user_id = result.rows[0].id;
                conn.release();
                if (process_1.default.env.TOKEN_SECRET) {
                    token = jsonwebtoken_1.default.sign({
                        id: parseInt(result.rows[0].id),
                        first_name: 'hassan',
                        last_name: 'yossry'
                    }, process_1.default.env.TOKEN_SECRET);
                    return [2 /*return*/, { user_id: user_id, token: token }];
                }
                else {
                    throw new Error('Token secret not provided');
                }
                return [2 /*return*/];
        }
    });
}); };
var prepare = function () { return __awaiter(void 0, void 0, void 0, function () {
    var conn, _a, user_id, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _b.sent();
                return [4 /*yield*/, conn.query('DELETE FROM order_products')];
            case 2:
                _b.sent();
                return [4 /*yield*/, conn.query('DELETE FROM orders')];
            case 3:
                _b.sent();
                return [4 /*yield*/, conn.query('DELETE FROM products')];
            case 4:
                _b.sent();
                return [4 /*yield*/, conn.query('DELETE FROM users')];
            case 5:
                _b.sent();
                conn.release();
                return [4 /*yield*/, insertUser()];
            case 6:
                _a = _b.sent(), user_id = _a.user_id, token = _a.token;
                return [2 /*return*/, { user_id: user_id, token: token }];
        }
    });
}); };
var insertProducts = function (name, price) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, tmp, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING *', [name, price])];
            case 2:
                tmp = (_a.sent());
                conn.release();
                return [2 /*return*/, tmp.rows[0]];
            case 3:
                err_1 = _a.sent();
                throw new Error("Insert products err ".concat(err_1));
            case 4: return [2 /*return*/];
        }
    });
}); };
describe('products test suit', function () {
    it('create product Api', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    token = (_a.sent()).token;
                    return [4 /*yield*/, req.post('/products').set('Authorization', "bearer ".concat(token)).send({ 'name': 'computer', "price": "1000" })];
                case 2:
                    res = _a.sent();
                    expect(res.body.id).toBeDefined();
                    return [4 /*yield*/, client_1.default.connect()];
                case 3:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM products WHERE id=$1', [parseInt(res.body.id)])];
                case 4:
                    res2 = _a.sent();
                    conn.release();
                    expect(res.status).toBe(200);
                    expect(res.body.name).toBe('computer');
                    expect(res.body.price).toBe(1000);
                    expect(res2.rows[0]).toBeDefined();
                    expect(res2.rows[0]).toEqual(res.body);
                    return [2 /*return*/];
            }
        });
    }); });
    it('index products API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt1, pdt2, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProducts('TV SET', 2000)];
                case 2:
                    pdt1 = _a.sent();
                    return [4 /*yield*/, insertProducts('PHONE', 100)];
                case 3:
                    pdt2 = _a.sent();
                    return [4 /*yield*/, req.get('/products')];
                case 4:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body.length).toBe(2);
                    expect(res.body).toEqual([pdt1, pdt2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('show products API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProducts('TV SET', 2000)];
                case 2:
                    pdt = _a.sent();
                    return [4 /*yield*/, req.get("/products/".concat(pdt.id))];
                case 3:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(pdt);
                    return [2 /*return*/];
            }
        });
    }); });
    it('deleting products API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt, conn1, res1, res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProducts('TV SET', 2000)];
                case 2:
                    pdt = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 3:
                    conn1 = _a.sent();
                    return [4 /*yield*/, conn1.query('SELECT * FROM products WHERE id=$1', [parseInt(pdt.id)])];
                case 4:
                    res1 = _a.sent();
                    conn1.release();
                    expect(res1.rowCount).toBe(1);
                    return [4 /*yield*/, req.delete("/products").send({ id: pdt.id })];
                case 5:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    return [4 /*yield*/, client_1.default.connect()];
                case 6:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM products WHERE id=$1', [parseInt(pdt.id)])];
                case 7:
                    res2 = _a.sent();
                    conn.release();
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
