
import supertest from 'supertest';
import client from '../../client'
import bcrypt from 'bcrypt';
import process from 'process';
import jwt from 'jsonwebtoken'
import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from '../product';


const app = express();
app.use(bodyParser.json())
const  server = app.listen(3000,()=>{console.log('listening ....')})
productRoutes(app);

const req = supertest(app)


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
    const conn = await client.connect();
    await conn.query('DELETE FROM order_products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    conn.release();

    const {user_id,token}= await insertUser()
    return {user_id,token};
}

const insertProducts= async ()=>{
    const conn = await client.connect();
    const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING id',['tv',10]))
    const product_id = tmp.rows[0].id
    await conn.query('INSERT INTO products(name, price) VALUES($1,$2)',['phone',20])
    conn.release();
    return product_id
}
describe('products test suit',
    ()=>{
    it('create product Api', async ()=>{
        const {token}=await prepare();
        const product_id =await insertProducts();
        const res = await req.post('/products').set('Authorization',`bearer ${token}`).send({'name':'computer',"price":"1000"});
        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM products WHERE id=$1',[parseInt(product_id)]);
        conn.release();
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('computer');
        expect(res.body.price).toBe(1000);
        expect(res2.rows[0]).toBeDefined();
        expect(res2.rows[0].id).toBeDefined();
        expect(res2.rows[0].id).toBe(product_id);




    });

    it('index products API ', async()=>{
        await prepare()
        await insertProducts();
        req.get('/products').then(res=>{
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body.length).toBe(2)
            
        })
    })
    it('show products API ',async ()=>{
        await prepare();
        const product_id=await insertProducts();
        const res = await req.get(`/products/${product_id}`)
        expect(res.body.id).toBeDefined()
        expect(res.body.id).toBe(product_id)
                 
    })
    it('deleting products API ',async ()=>{
        await prepare();
        const product_id=await insertProducts();

        const conn1 = await client.connect();
        const res1 = await conn1.query('SELECT * FROM products WHERE id=$1',[parseInt(product_id)]);
        conn1.release();

        expect(res1.rowCount).toBe(1);

        const res = await req.delete(`/products`).send({id:product_id})
        expect(res.statusCode).toBe(200)

        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM products WHERE id=$1',[parseInt(product_id)]);
        conn.release();
        expect(res2.rowCount).toBe(0);

                  
    })

    

    afterAll(async ()=>{
        server.close()
       })

})

  