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
var order_1 = __importDefault(require("../order"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
var server = app.listen(3001, function () { console.log('listening ....'); });
(0, order_1.default)(app);
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
    var conn, _a, user_id, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                return [4 /*yield*/, client_1.default.connect()];
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
            case 7:
                err_1 = _b.sent();
                throw new Error("A prepare Error ".concat(err_1));
            case 8: return [2 /*return*/];
        }
    });
}); };
var insertProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, conn, tmp, product_id, order_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, insertUser()];
            case 1:
                user_id = (_a.sent()).user_id;
                return [4 /*yield*/, client_1.default.connect()];
            case 2:
                conn = _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING id', ['tv', 10])];
            case 3:
                tmp = (_a.sent());
                product_id = tmp.rows[0].id;
                return [4 /*yield*/, conn.query('INSERT INTO products(name, price) VALUES($1,$2)', ['phone', 20])];
            case 4:
                _a.sent();
                return [4 /*yield*/, conn.query('INSERT INTO orders(user_id, complete) VALUES($1,$2) RETURNING id', [parseInt(user_id), false])];
            case 5:
                order_id = (_a.sent()).rows[0].id;
                return [4 /*yield*/, conn.query('INSERT INTO order_products(order_id, product_id, quantity) VALUES($1,$2, $3)', [parseInt(order_id), parseInt(product_id), 3])];
            case 6:
                _a.sent();
                conn.release();
                return [2 /*return*/, { product_id: product_id, order_id: order_id }];
        }
    });
}); };
describe('Testing product api', function () {
    it('create order Api', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user_id, res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, prepare()];
                case 1:
                    user_id = (_a.sent()).user_id;
                    return [4 /*yield*/, (req.post('/orders').send({ 'user_id': (user_id), "complete": false }))];
                case 2:
                    res = _a.sent();
                    expect(res.body.user_id).toBe(user_id);
                    expect(res.body.complete).toBe(false);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.log("error in create order ".concat(err_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('index order API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var order_id, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProducts()];
                case 2:
                    order_id = (_a.sent()).order_id;
                    return [4 /*yield*/, req.get('/orders')];
                case 3:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].id).toBe(order_id);
                    return [2 /*return*/];
            }
        });
    }); });
    it('show order API ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var order_id, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertProducts()];
                case 2:
                    order_id = (_a.sent()).order_id;
                    return [4 /*yield*/, req.get("/orders/".concat(order_id))];
                case 3:
                    res = _a.sent();
                    expect(res.body.id).toBeDefined();
                    expect(res.body.id).toBe(order_id);
                    return [2 /*return*/];
            }
        });
    }); });
    it('List orders from a user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, token, user_id, _b, product_id, order_id, res;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _a = _c.sent(), token = _a.token, user_id = _a.user_id;
                    return [4 /*yield*/, insertProducts()];
                case 2:
                    _b = _c.sent(), product_id = _b.product_id, order_id = _b.order_id;
                    return [4 /*yield*/, req.get("/orders/user/".concat(user_id))
                            .set('Authorization', "Bearer ".concat(token))];
                case 3:
                    res = _c.sent();
                    expect(res.body).toBeInstanceOf(Array);
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
/*
describe('Testing product api', ()=>{
    beforeAll(async ()=>{
        let saltings = '10';
        let pepper = 'this is default'

        if(process.env.SECRET_KEY)pepper = process.env.SECRET_KEY;
        if(process.env.SALTING_ROUNDS)saltings = process.env.SALTING_ROUNDS+'';

        const hash = bcrypt.hashSync('sus'+pepper,parseInt(saltings));
        const conn = await client.connect();
        const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING id',['hassan','yossry',hash])
        if(process.env.TOKEN_SECRET){
            token = jwt.sign({
                id:parseInt(result.rows[0].id),
                first_name:'hassan',
                last_name:'yossry'
            },
                process.env.TOKEN_SECRET as string);
           
        }
        else{throw new Error('Token secret not provided')}
        const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING id',['tv',10]))
        product_id = tmp.rows[0].id
        await conn.query('INSERT INTO products(name, price) VALUES($1,$2)',['phone',20])
        conn.release();
        
        
    })

    it('create product Api', async ()=>{
        const res = await req.post('/products').set('Authorization',`bearer ${token}`).send({'name':'computer',"price":"1000"});
        
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('computer');
        expect(res.body.price).toBe(1000);

    });

    it('index products API ', (done)=>{
        req.get('/products').then(res=>{
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array)
            done();
        })
    })
    it('show products API ',async ()=>{
        const res = await req.get(`/products/${product_id}`)
        expect(res.body.id).toBeDefined()
        expect(res.body.id).toBe(product_id)


            
    })
    afterAll(async ()=>{
        const conn = await client.connect();
        await conn.query('DELETE FROM order_products');
        await conn.query('DELETE FROM products');
        await conn.query('DELETE FROM users');
        conn.release();
        server.close();

    })
    
})

describe('Testing product api', ()=>{
    beforeAll(async ()=>{
        let saltings = '10';
        let pepper = 'this is default'

        if(process.env.SECRET_KEY)pepper = process.env.SECRET_KEY;
        if(process.env.SALTING_ROUNDS)saltings = process.env.SALTING_ROUNDS+'';

        const hash = bcrypt.hashSync('sus'+pepper,parseInt(saltings));
        const conn = await client.connect();
        const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING id',['hassan','yossry',hash])
        if(process.env.TOKEN_SECRET){
            token = jwt.sign({
                id:parseInt(result.rows[0].id),
                first_name:'hassan',
                last_name:'yossry'
            },
                process.env.TOKEN_SECRET as string);
           
        }
        else{throw new Error('Token secret not provided')}
        const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING id',['tv',10]))
        product_id = tmp.rows[0].id
        await conn.query('INSERT INTO products(name, price) VALUES($1,$2)',['phone',20])
        conn.release();
        
        
    })

    it('create product Api', async ()=>{
        const res = await req.post('/products').set('Authorization',`bearer ${token}`).send({'name':'computer',"price":"1000"});
        
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('computer');
        expect(res.body.price).toBe(1000);

    });

    it('index products API ', (done)=>{
        req.get('/products').then(res=>{
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array)
            done();
        })
    })
    it('show products API ',async ()=>{
        const res = await req.get(`/products/${product_id}`)
        expect(res.body.id).toBeDefined()
        expect(res.body.id).toBe(product_id)


            
    })
    afterAll(async ()=>{
        const conn = await client.connect();
        await conn.query('DELETE FROM order_products');
        await conn.query('DELETE FROM products');
        await conn.query('DELETE FROM users');
        conn.release();
        server.close();

    })
    
})

describe("Testing users handlers",()=>{
    beforeAll(async ()=>{
        const conn = await client.connect();
        let pepper = process.env.pepper;
        let saltings = '10';
        if(process.env.SALT_ROUNDS)saltings = process.env.SALT_ROUNDS
        if(!pepper)pepper = 'this is default';
        const password = bcrypt.hashSync("sus"+pepper,parseInt(saltings))
        const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING id',['hassan','yossry',password])
        conn.release();
        user_id =result.rows[0].id;
        console.log('kkkkkkkkkkkkkk')

        
    })
    

    afterAll(async ()=>{
        const conn = await client.connect();
        await conn.query('DELETE FROM users');
        conn.release();
    })

    it('Login api point', async ()=>{
        const res = await  req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"sus"})
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();

            token = res.body.token
            //console.log('ggggg')
            
    })
 it('Login api point error', (done)=>{
        
        req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"suss"})
        .then((res)=>{
            expect(res.statusCode).toEqual(401);
            expect(res.body.token).not.toBeDefined();
            done()
            })
            
            
    })

    it('create user Api', async ()=>{
        const res = await req.post('/users').set('Authorization',`bearer ${token}`).send({'first_name':'toqa',"last_name":"hossam","password":"pass123"});
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();



        });

    it('index users API ', (done)=>{
        req.get('/users').set('Authorization',`bearer ${token}`).then(res=>{
            expect(res.body).toBeInstanceOf(Array)
            done();
        })
    })
    




    it('show user API ',async ()=>{
        const res = await req.get(`/users/${user_id}`).set('Authorization',`bearer ${token}`)
        expect(res.body.id).toBeDefined()
            
    })
    
    it('Delete user API',done=>{
        req.delete('/users').set('Authorization',`bearer ${token}`).send(
            {id:user_id}
        ).then(res =>{
            expect(res.statusCode).toBe(200);
            done();
        })
    }) })
    */ 
