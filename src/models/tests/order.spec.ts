import { Order_Manager } from "../orders";
import { User } from "../users";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const manager = new Order_Manager;
const insertOrder= async(user_id:string,complete:boolean)=>{
    try{
        const conn = await client.connect();
        const res = await conn.query('INSERT INTO orders(user_id,complete) VALUES($1,$2) RETURNING *',[user_id,complete]);
        conn.release();
        return res.rows[0];
    }catch(err){
        throw new Error(`A prepare Error ${err}`)
    }
}
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
const insertProducts = async (name:string, price:number)=>{
    const conn = await client.connect();
    const tmp= (await conn.query('INSERT INTO products(name, price) VALUES($1,$2) RETURNING *',[name,price]))

    conn.release();
    return tmp.rows[0];
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

describe("Products testing",()=>{
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
    it("Expect CREATe to make a new product",async()=>{
        const {user} =await insertUser('hassan','yossry','pass123');
        const res = await manager.create({id:0,user_id:user.id,complete:false});
        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM orders WHERE user_id = $1 AND complete = $2',[user.id,false]);
        conn.release();
        expect(res2.rowCount).toBe(1);
        expect(res2.rows[0]).toEqual(res);

    })

    it("Expect index to make a return an array",async()=>{
        const {user} =await insertUser('hassan','yossry','pass123');
        const ordr1 = await insertOrder(String(user.id),false);
        const ordr2 = await insertOrder(String(user.id),false);

        const res = await manager.index();

        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBe(2);
        expect(res).toEqual([ordr1,ordr2]);

    })
    
    it("Expect show to return an order",async()=>{
        const {user} =await insertUser('hassan','yossry','pass123');
        const ordr = await insertOrder(String(user.id),false);
        const res = await manager.show(String(ordr.id));
        expect(res).toBeDefined();
        expect(res).toEqual(ordr);
    })

    it("Expect to delete an order",async()=>{
    
        const {user} =await insertUser('hassan','yossry','pass123');
        const ordr = await insertOrder(String(user.id),false);

        const res = await manager.delete(String(ordr.id));
        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM orders WHERE id = $1',[ordr.id])
        conn.release();
        expect(res2.rowCount).toBe(0);

    })

    it("Expect list user orders to work",async()=>{
        const {user:user,token} = await insertUser('hassan','yossry','pass123');
        const order = await insertOrder(String(user.id),false);
        const pdt1 = await insertProducts('TV SET',300);
        const pdt2 = await insertProducts('PHONE SET',300);
        const pdt3 = await insertProducts('playstation SET',300);

        const ordPdt1 = await insertOrderProduct(pdt1.id,order.id,2);
        const ordPdt2 = await insertOrderProduct(pdt2.id,order.id,2);
        const ordPdt3 = await insertOrderProduct(pdt3.id,order.id,2);
        const result = await manager.orders_from_user(String(user.id))

        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toEqual({...order, product_id:pdt1.id, quantity:2});
        expect(result[1]).toEqual({...order, product_id:pdt2.id, quantity:2});
        expect(result[2]).toEqual({...order, product_id:pdt3.id, quantity:2});





    })
})