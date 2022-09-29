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
var products_1 = require("../products");
var client_1 = __importDefault(require("../../client"));
var manager = new products_1.Product_Manager;
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
var insertProduct = function (name, price) { return __awaiter(void 0, void 0, void 0, function () {
    var conn, res, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO products(name,price) VALUES($1,$2) RETURNING *', [name, price])];
            case 2:
                res = _a.sent();
                conn.release();
                return [2 /*return*/, res.rows[0]];
            case 3:
                err_2 = _a.sent();
                throw new Error("A prepare Error ".concat(err_2));
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
    it("Expect CREATe to make a new product", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, manager.create({ id: 0, name: 'TV SET', price: 2000 })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 3:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM products WHERE name = $1 AND price = $2', ['TV SET', 2000])];
                case 4:
                    res2 = _a.sent();
                    conn.release();
                    expect(res2.rowCount).toBe(1);
                    expect(res2.rows[0].name).toBe('TV SET');
                    expect(res2.rows[0].price).toBe(2000);
                    expect(res2.rows[0].id).toBe(res.id);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect index to make a return an array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt1, pdt2, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProduct('TV SET', 2000)];
                case 2:
                    pdt1 = _a.sent();
                    return [4 /*yield*/, insertProduct('PHONE SET', 3000)];
                case 3:
                    pdt2 = _a.sent();
                    return [4 /*yield*/, manager.index()];
                case 4:
                    res = _a.sent();
                    expect(res).toBeInstanceOf(Array);
                    expect(res.length).toBe(2);
                    expect(res[0]).toEqual(pdt1);
                    expect(res[1]).toEqual(pdt2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect show to return a product", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProduct('TV SET', 2000)];
                case 2:
                    pdt = _a.sent();
                    return [4 /*yield*/, manager.show(String(pdt.id))];
                case 3:
                    res = _a.sent();
                    expect(res).toBeDefined();
                    expect(res).toEqual(pdt);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Expect delete to delete a product", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pdt, res, conn, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProduct('TV SET', 2000)];
                case 2:
                    pdt = _a.sent();
                    return [4 /*yield*/, manager.delete(String(pdt.id))];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, client_1.default.connect()];
                case 4:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('SELECT * FROM products WHERE id = $1', [pdt.id])];
                case 5:
                    res2 = _a.sent();
                    conn.release();
                    expect(res2.rowCount).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
