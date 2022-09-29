"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var orders_1 = require("../orders");
var client_1 = __importDefault(require("../../client"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var manager = new orders_1.Order_Manager;
var insertOrder = function (user_id, complete) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, res, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO orders(user_id,complete) VALUES($1,$2) RETURNING *', [user_id, complete])];
            case 2:
                res = _a.sent();
                conn.release();
                return [2 /*return*/, res.rows[0]];
            case 3:
                err_1 = _a.sent();
                throw new Error("A prepare Error ".concat(err_1));
            case 4: return [2 /*return*/];
        }
    });
}); };
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
var insertProducts = function (name, price) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, tmp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING *', [name, price])];
            case 2:
                tmp = (_a.sent());
                conn.release();
                return [2 /*return*/, tmp.rows[0]];
        }
    });
}); };
var insertOrderProduct = function (pid, order_id, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, tmp, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO order_products(product_id, order_id,quantity) VALUES($1,$2,$3) RETURNING *', [pid, order_id, quantity])];
            case 2:
                tmp = _a.sent();
                conn.release();
                return [2 /*return*/, tmp.rows[0]];
            case 3:
                err_2 = _a.sent();
                throw new Error("insert order ".concat(err_2));
            case 4: return [2 /*return*/];
        }
    });
}); };
describe("Products testing", function () {
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
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var conn, err_3;
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
                    err_3 = _a.sent();
                    throw new Error("A prepare Error ".concat(err_3));
                case 7: return [2 /*return*/];
            }
        });
    }); });
    it("Expect CREATe to make a new product", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    user = (_a.sent()).user;
                    return [4 /*yield*/, manager.create({ id: 0, user_id: user.id, complete: false })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 3:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM orders WHERE user_id = $1 AND complete = $2', [user.id, false])];
                case 4:
                    res2 = _a.sent();
                    conn.release();
                    expect(res2.rowCount).toBe(1);
                    expect(res2.rows[0]).toEqual(res);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect index to make a return an array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, ordr1, ordr2, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    user = (_a.sent()).user;
                    return [4 /*yield*/, insertOrder(String(user.id), false)];
                case 2:
                    ordr1 = _a.sent();
                    return [4 /*yield*/, insertOrder(String(user.id), false)];
                case 3:
                    ordr2 = _a.sent();
                    return [4 /*yield*/, manager.index()];
                case 4:
                    res = _a.sent();
                    expect(res).toBeInstanceOf(Array);
                    expect(res.length).toBe(2);
                    expect(res).toEqual([ordr1, ordr2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect show to return an order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, ordr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    user = (_a.sent()).user;
                    return [4 /*yield*/, insertOrder(String(user.id), false)];
                case 2:
                    ordr = _a.sent();
                    return [4 /*yield*/, manager.show(String(ordr.id))];
                case 3:
                    res = _a.sent();
                    expect(res).toBeDefined();
                    expect(res).toEqual(ordr);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect to delete an order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, ordr, res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    user = (_a.sent()).user;
                    return [4 /*yield*/, insertOrder(String(user.id), false)];
                case 2:
                    ordr = _a.sent();
                    return [4 /*yield*/, manager.delete(String(ordr.id))];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 4:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM orders WHERE id = $1', [ordr.id])];
                case 5:
                    res2 = _a.sent();
                    conn.release();
                    expect(res2.rowCount).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect list user orders to work", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, token, order, pdt1, pdt2, pdt3, ordPdt1, ordPdt2, ordPdt3, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertUser('hassan', 'yossry', 'pass123')];
                case 1:
                    _a = _b.sent(), user = _a.user, token = _a.token;
                    return [4 /*yield*/, insertOrder(String(user.id), false)];
                case 2:
                    order = _b.sent();
                    return [4 /*yield*/, insertProducts('TV SET', 300)];
                case 3:
                    pdt1 = _b.sent();
                    return [4 /*yield*/, insertProducts('PHONE SET', 300)];
                case 4:
                    pdt2 = _b.sent();
                    return [4 /*yield*/, insertProducts('playstation SET', 300)];
                case 5:
                    pdt3 = _b.sent();
                    return [4 /*yield*/, insertOrderProduct(pdt1.id, order.id, 2)];
                case 6:
                    ordPdt1 = _b.sent();
                    return [4 /*yield*/, insertOrderProduct(pdt2.id, order.id, 2)];
                case 7:
                    ordPdt2 = _b.sent();
                    return [4 /*yield*/, insertOrderProduct(pdt3.id, order.id, 2)];
                case 8:
                    ordPdt3 = _b.sent();
                    return [4 /*yield*/, manager.orders_from_user(String(user.id))];
                case 9:
                    result = _b.sent();
                    expect(result).toBeInstanceOf(Array);
                    expect(result[0]).toEqual(__assign(__assign({}, order), { product_id: pdt1.id, quantity: 2 }));
                    expect(result[1]).toEqual(__assign(__assign({}, order), { product_id: pdt2.id, quantity: 2 }));
                    expect(result[2]).toEqual(__assign(__assign({}, order), { product_id: pdt3.id, quantity: 2 }));
                    return [2 /*return*/];
            }
        });
    }); });
});
