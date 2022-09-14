import app from '../../server';
import supertest from 'supertest';
import client from '../../client'
import bcrypt from 'bcrypt';
import process from 'process'
const req = supertest(app)
let token = '';
let user_id = '';
describe("Testing users handlers",()=>{
    beforeAll(async ()=>{
        const conn = await client.connect();
        let pepper = process.env.pepper;
        let saltings = '10';
        if(process.env.SALT_ROUNDS)saltings = process.env.SALT_ROUNDS
        if(!pepper)pepper = 'this is default';
        const password = bcrypt.hashSync("sus"+pepper,parseInt(saltings))
        const result = await conn.query('INSERT INTO users(first_name,last_name,password) VALUES($1,$2,$3)',['hassan','yossry',password])
    })
    it('Login api point', (done)=>{
        
        const resp =  req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"sus"})
        .then((res)=>{
            expect(res.statusCode).toBe(200);
            token = res.body.token
            expect(token).toBeDefined();
            done()})
    })
    it('Login api point error', (done)=>{
        
        req.post('/users/login').send({"first_name":"hassan","last_name":"yossry","password":"suss"})
        .then((res)=>{
            expect(res.statusCode).toEqual(400);
            expect(res.body.token).not.toBeDefined();
            done()})
    })

    it('index order API ',(done)=>{
        req.get('/orders').then(res=>{
            expect(res.body).toBeInstanceOf(Array)
            done();
        })
    })
    


    it('Create user API ',(done)=>{
        req.post('/users').set('Authorization',`bearer ${token}`).send(
            {"first_name":"toqa","last_name":"helmy","password":"sassy"}
            ).then(res=>{
            expect(res.status).toBe(200)
            expect(res.body.first_name).toBe('toqa');
            expect(res.body.last_name).toBe('helmy');
            expect(res.body.id).toBeDefined();
            order_id = res.body.id;
            done();
        })
    })

    it('show user API ',(done)=>{
        req.get('/users/1').set('Authorization',`bearer ${token}`).then(res=>{
            expect(res.body.id).toBeDefined()
            done();
        })
    })
fit('Delete user API',done=>{
        req.delete('/users').set('Authorization',`bearer ${token}`).send(
            {id:user_id}
        ).then(res =>{
            expect(res.statusCode).toBe(400);
            expect(res.body.id)
            done();
        })
    })
   // afterAll(()=>console.log(token))
})