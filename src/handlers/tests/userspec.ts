
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


describe("Testing users handlers",
    ()=>{

        beforeEach(async()=>{
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


    it('Login api point', async ()=>{
            
            await insertUser('hassan','yossry','sus')
               
            const res = await  req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"sus"})
            
            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            
            
            
            
            
    })
 it('Login api point error', async ()=>{
        const res = await req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"suss"})
        

        expect(res.statusCode).toEqual(401);
        expect(res.body.token).not.toBeDefined();
        
            
            
            
    })

    it('create user Api', async ()=>{
        const {token} = await insertUser('hassan','yossry','pass123');
        const res = await req.post('/users').send({'first_name':'toqa',"last_name":"hossam","password":"pass123"});
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
         });

    it('index users API ', async ()=>{
        const {user:user1,token} = await insertUser('hassan','yossry','pass123');
        const {user:user2} = await insertUser('toqa','hossam','pass123');

        const res = await req.get('/users').set('Authorization',`bearer ${token}`)
        expect(res.statusCode).toBe(200);
        
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toEqual([user1,user2])

    })
    




    it('show user API ',async ()=>{
        
        const {user,token} = await insertUser('hassan','yossry','pass123');
       
        const res = await req.get(`/users/${user.id}`).set('Authorization',`bearer ${token}`)
        expect(res.statusCode).toBe(200);

        expect(res.body).toBeDefined()
        expect(res.body).toEqual(user)


            
    })
    
    it('Delete user API',async ()=>{
        const {user,token} = await insertUser('hassan','yossry','pass123');
        const conn = await client.connect();
        const res1 = await conn.query('SELECT * FROM users WHERE id = $1',[parseInt(user.id)])
        expect(res1.rowCount).toBe(1);
        
        const res = await req.delete('/users').set('Authorization',`bearer ${token}`).send(
            {id:user.id})
        expect(res.statusCode).toBe(200);
        const res2 = await conn.query('SELECT * FROM users WHERE id = $1',[parseInt(user.id)])
        expect(res2.rowCount).toBe(0)
            
            
        })
        
       

   afterAll(async ()=>{
    server.close()
   })
})
