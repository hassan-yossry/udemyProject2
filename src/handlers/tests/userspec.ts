
import supertest from 'supertest';
import client from '../../client'
import bcrypt from 'bcrypt';
import process from 'process';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from '../user';
import jwt from 'jsonwebtoken';
const app = express();
app.use(bodyParser.json())
const  server = app.listen(3002,()=>{console.log('listening ....')})
userRoutes(app);

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
    conn.release()   
   
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
describe("Testing users handlers",
    ()=>{
    it('Login api point', async ()=>{
        
            await prepare();
               
            const res = await  req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"sus"})
            
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            
            
            
            
    })
 it('Login api point error', async ()=>{
        await prepare();
        const res = await req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"suss"})
        

        expect(res.statusCode).toEqual(401);
        expect(res.body.token).not.toBeDefined();
        
            
            
            
    })

    it('create user Api', async ()=>{
        const {token} = await prepare();
        const res = await req.post('/users').set('Authorization',`bearer ${token}`).send({'first_name':'toqa',"last_name":"hossam","password":"pass123"});
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
         });

    it('index users API ', async ()=>{
        const {token} = await prepare();
        const res = await req.get('/users').set('Authorization',`bearer ${token}`)
        
        expect(res.body).toBeInstanceOf(Array)
    })
    




    it('show user API ',async ()=>{
        
        const {user_id,token} = await prepare();
       
        const res = await req.get(`/users/${user_id}`).set('Authorization',`bearer ${token}`)

        expect(res.body.id).toBeDefined()

            
    })
    
    it('Delete user API',done=>{
        prepare().then(val=>{
            req.delete('/users').set('Authorization',`bearer ${val.token}`).send(
                {id:val.user_id}
            ).then(res =>{
                expect(res.statusCode).toBe(200);
                done();
            })
        })
        
    })   

   afterAll(async ()=>{
    server.close()
   })
})
