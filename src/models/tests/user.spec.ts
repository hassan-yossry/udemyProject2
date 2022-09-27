import { User_Manager ,User} from "../users";
import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const encrypt_pass = (password:string):string=>{
    let saltings = '10';
    let pepper = 'this is default'
    if(process.env.SECRET_KEY)pepper = process.env.SECRET_KEY;
    if(process.env.SALTING_ROUNDS)saltings = process.env.SALTING_ROUNDS+'';
    const hash = bcrypt.hashSync(password+pepper,parseInt(saltings));
    return hash;
}


const insertUser = async (first_name:string,last_name:string,password:string):Promise<{user:User,token:string}>=>{
    const hash = encrypt_pass(password)
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


const manager = new User_Manager;
const prepare =async ()=>{
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
    
}

describe("Products testing",()=>{
    beforeEach(async()=>{
        await prepare();
    })
    it("Expect create to be defined",()=>{
        expect(manager.create).toBeDefined();
    })
    it('Expect index to be defined',()=>{
        expect(manager.index).toBeDefined()
    })
    it('Exepect show to be defined',()=>{
        expect(manager.show).toBeDefined()
    })
    it('Exepect delete to be defined',()=>{
        expect(manager.delete).toBeDefined()
    })

    it('Expect create user to create user',async ()=>{
        const user = await manager.create(
            {
                id:0,
                first_name:"hassan" ,
                last_name:"yossry",
                password:"password123"
            })

        const conn = await client.connect();
        const result = await conn.query('SELECT * FROM users WHERE id = $1',[user.id])
        conn.release();
        expect(result.rows[0]).toBeDefined();
        expect(result.rows[0].id).toBe(user.id);
        expect(result.rows[0].first_name).toBe(user.first_name);
        expect(result.rows[0].last_name).toBe(user.last_name);
    })

    it('Expect index to produce an array of results',async()=>{
        await prepare();
        await insertUser('hassan','yossry','pass123');
        await insertUser('toqa','hossam','pass456');
        const result = await manager.index();
        expect(result.length).toBe(2);
        expect(result[0].id).toBeDefined();
        expect(result[0].first_name).toBeDefined();
        expect(result[0].first_name).toBe('hassan');
        expect(result[0].last_name).toBeDefined();
        expect(result[0].last_name).toBe('yossry');
        expect(result[0].password).toBeDefined();


        expect(result[1].id).toBeDefined();
        expect(result[1].first_name).toBeDefined();
        expect(result[1].first_name).toBe('toqa');
        expect(result[1].last_name).toBeDefined();
        expect(result[1].last_name).toBe('hossam');
        expect(result[1].password).toBeDefined();
    })

    it('Expect show to retrieve user',async ()=>{
        await prepare();
        const {user,token} = await insertUser('hassan','yossry','pass123') ;
        const result = await manager.show(String(user.id));
        expect(result.first_name).toBe('hassan');
        expect(result.last_name).toBe('yossry'); 

    })
    it('Expect delete to re  user',async ()=>{
        await prepare();
        const {user,token} = await insertUser('hassan','yossry','pass123') ;
        const result = await manager.show(String(user.id));
        expect(result.first_name).toBe('hassan');
        expect(result.last_name).toBe('yossry'); 

    })


})