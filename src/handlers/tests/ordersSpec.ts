import supertest from 'supertest';
import client from '../../client'
import bcrypt from 'bcrypt';
import process from 'process';
import jwt from 'jsonwebtoken'
import express from 'express';
import orderRoutes from '../order';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json())
const server = app.listen(3001,()=>{console.log('listening ....')})
orderRoutes(app);


const req = supertest(app);




const insertUser = async ()=>{
    let saltings = '10';
    let pepper = 'this is default'
    if(process.env.SECRET_KEY)pepper = process.env.SECRET_KEY;
    if(process.env.SALTING_ROUNDS)saltings = process.env.SALTING_ROUNDS+'';
    const hash = bcrypt.hashSync('sus'+pepper,parseInt(saltings));
    const conn = await client.connect();
    const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING id',['hassan','yossry',hash])
   
    const user_id = result.rows[0].id;
    conn.release();
   
    if(process.env.TOKEN_SECRET){
       const token = jwt.sign({
            id:parseInt(result.rows[0].id),
            first_name:'hassan',
            last_name:'yossry'
        },
            process.env.TOKEN_SECRET as string);
        return {user_id,token}
       
    }
    else{throw new Error('Token secret not provided')}
}

const prepare =async ()=>{
    try{
    const conn = await client.connect();
    await conn.query('DELETE FROM order_products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    conn.release();

    const {user_id,token}= await insertUser()
    return {user_id,token};
    }catch(err){
        throw new Error(`A prepare Error ${err}`)
    }
    
}
const insertProducts = async ()=>{
    const {user_id} = await insertUser();
    const conn = await client.connect();
    const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING id',['tv',10]))
    const product_id = tmp.rows[0].id
    await conn.query('INSERT INTO products(name, price) VALUES($1,$2)',['phone',20])
    const order_id =( await conn.query('INSERT INTO orders(user_id, complete) VALUES($1,$2) RETURNING id',[parseInt( user_id),false])).rows[0].id
    await conn.query('INSERT INTO order_products(order_id, product_id, quantity) VALUES($1,$2, $3)',[parseInt(order_id),parseInt( product_id),3])
    
    conn.release();
    return {product_id,order_id};
}

describe('Testing product api', 
    ()=>{

    it('create order Api', async ()=>{
        try{
        const {user_id,} = await prepare();
        const res = await (req.post('/orders').send({'user_id':(user_id),"complete":false}));   
        expect(res.body.user_id).toBe(user_id);
        expect(res.body.complete).toBe(false);

        }catch(err){
            console.log(`error in create order ${err}`)
        }
        
    });

    it('index order API ', async ()=>{
        await prepare()
        const {order_id} = await insertProducts()
        const res = await req.get('/orders')
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBe(1)
        expect(res.body[0].id).toBe(order_id)
        expect(res.body[0].complete).toBeFalse()



            
        
    })
    it('show order API ',async ()=>{
        await prepare();
        const {order_id} = await insertProducts();
        const res = await req.get(`/orders/${order_id}`)
        expect(res.body.id).toBeDefined()
        expect(res.body.id).toBe(order_id)

    
            
    })

    it('List orders from a user', async()=>{
        const {token,user_id} = await prepare();
        const {product_id, order_id} = await insertProducts();
        const res = await  req.get(`/orders/user/${user_id}`)
                           .set('Authorization',`Bearer ${token}`);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toBe('tv');


    })
    afterAll(async ()=>{
        server.close()
       })
})