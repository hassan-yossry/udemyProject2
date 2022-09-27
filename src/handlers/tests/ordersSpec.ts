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




const insertUser = async (first_name:string,last_name:string,pass:string)=>{
    let saltings = '10';
    let pepper = 'this is default'
    if(process.env.SECRET_KEY)pepper = process.env.SECRET_KEY;
    if(process.env.SALTING_ROUNDS)saltings = process.env.SALTING_ROUNDS+'';
    const hash = bcrypt.hashSync(pass+pepper,parseInt(saltings));
    const conn = await client.connect();
    const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3) RETURNING *',[first_name,last_name,hash])
    
    const user = result.rows[0];
    conn.release()   
   
    if(process.env.TOKEN_SECRET){
       const token = jwt.sign({
            id:parseInt(result.rows[0].id),
            first_name:'hassan',
            last_name:'yossry'
        },
            process.env.TOKEN_SECRET as string);
        return {user,token}
    }
    else{throw new Error('Token secret not provided')}
}

const insertProducts = async (name:string, price:number)=>{
    const conn = await client.connect();
    const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING *',[name,price]))

    conn.release();
    return tmp.rows[0];
}

const insertOrder = async (user_id:number,complete:boolean)=>{
    try{
        const conn = await client.connect();
        const tmp= (await conn.query('INSERT INTO orders(user_id, complete) VALUES($1,$2) RETURNING *',[user_id,complete]))
        conn.release();
        return tmp.rows[0];
    }catch(err){
        throw new Error(`insert order ${err}`);
    }


}

const insertOrderProduct= async(pid:number,order_id:number,quantity:number)=>{
    try{
        const conn = await client.connect();
        const tmp= await conn.query('INSERT INTO order_products(product_id, order_id,quantity) VALUES($1,$2,$3) RETURNING *',[pid,order_id,quantity])
        conn.release();
        return tmp.rows[0];
    }catch(err){
        throw new Error(`insert order ${err}`);
    }

}
describe('Testing product api', 
    ()=>{
    beforeEach(async ()=>{
        try{
            const conn = await client.connect();
            await conn.query('DELETE FROM order_products');
            await conn.query('DELETE FROM orders');
            await conn.query('DELETE FROM products');
            await conn.query('DELETE FROM users');
            conn.release();
        
        
            }catch(err){
                throw new Error(`A prepare Error ${err}`)
            }
    })
    it('create order Api', async ()=>{
        try{
        const {user,} = await insertUser('hassan','yossry','pass123');
        const res = await (req.post('/orders').send({'user_id':(user.id),"complete":false}));   
        expect(res.body.user_id).toBe(user.id);
        expect(res.body.complete).toBe(false);

        }catch(err){
            console.log(`error in create order ${err}`)
        }
        
    });

    it('index order API ', async ()=>{
        const {user:user1,} = await insertUser('hassan','yossry','pass123');

        const {user:user2} = await insertUser('toqa','hossam','pass123');

        const order1 = await insertOrder(user1.id,false);
        const order2 = await insertOrder(user2.id,false);
        const res = await req.get('/orders')
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toEqual([order1,order2])



            
        
    })
    it('show order API ',async ()=>{
        const {user:user,} = await insertUser('hassan','yossry','pass123');
        const order = await insertOrder(user.id,false);

        const res = await req.get(`/orders/${order.id}`)
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined()
        expect(res.body).toEqual(order)

    
            
    })
    it('Delete order API',async ()=>{
        const {user:user,} = await insertUser('hassan','yossry','pass123');
        const order = await insertOrder(user.id,false);
        const conn = await client.connect();

        const res1 = await conn.query('SELECT * FROM orders WHERE id = $1',[parseInt(order.id)])
        expect(res1.rowCount).toBe(1)
        const resHTTP =await req.delete('/orders/').send({id:order.id})
        expect(resHTTP.status).toBe(200);

        expect(resHTTP.statusCode).toBe(200);

        const res2 = await conn.query('SELECT * FROM orders WHERE id = $1',[parseInt(order.id)])
        expect(res2.rowCount).toBe(0)
            
            
        })
    it('List orders from a user', async()=>{
        const {user:user,token} = await insertUser('hassan','yossry','pass123');
        const order = await insertOrder(user.id,false);
        const pdt1 = await insertProducts('TV SET',300);
        const pdt2 = await insertProducts('PHONE SET',300);
        const pdt3 = await insertProducts('playstation SET',300);

        const ordPdt1 = await insertOrderProduct(pdt1.id,order.id,2);
        const ordPdt2 = await insertOrderProduct(pdt2.id,order.id,2);

        const ordPdt3 = await insertOrderProduct(pdt3.id,order.id,2);


        const res = await  req.get(`/orders/user/${user.id}`)
                           .set('Authorization',`Bearer ${token}`);
        expect(res.status).toBe(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toEqual([pdt1,pdt2,pdt3]);


    })
    afterAll(async ()=>{
        server.close()
       })
})