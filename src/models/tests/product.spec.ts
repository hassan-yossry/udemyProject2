import { Product_Manager } from "../products";
import client from '../../client';

const manager = new Product_Manager;

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

const insertProduct= async(name:string,price:number)=>{
    try{
        const conn = await client.connect();
        const res = await conn.query('INSERT INTO products(name,price) VALUES($1,$2) RETURNING *',[name,price]);
        conn.release();
        return res.rows[0];
    }catch(err){
        throw new Error(`A prepare Error ${err}`)
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

    it("Expect CREATe to make a new product",async()=>{
        await prepare();
        const res = await manager.create({id:0,name:'TV SET',price:2000});
        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM products WHERE name = $1 AND price = $2',['TV SET',2000]);
        conn.release();
        expect(res2.rowCount).toBe(1);
        expect(res2.rows[0].name).toBe('TV SET');
        expect(res2.rows[0].price).toBe(2000);
        expect(res2.rows[0].id).toBe(res.id);

    })

    it("Expect index to make a return an array",async()=>{
        await prepare();
    
        const pdt1 = await insertProduct('TV SET',2000);
        const pdt2 = await insertProduct('PHONE SET',3000);
        const res = await manager.index();

        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBe(2);
        expect(res[0]).toEqual(pdt1);
        expect(res[1]).toEqual(pdt2);

    })

    it("Expect show to return a product",async()=>{
        await prepare();
    
        const pdt = await insertProduct('TV SET',2000);
        const res = await manager.show(String(pdt.id));

        expect(res).toBeDefined();
        expect(res).toEqual(pdt);

    })

    it("Expect delete to delete a product",async()=>{
        await prepare();
    
        const pdt = await insertProduct('TV SET',2000);
        const res = await manager.delete(String(pdt.id));
        const conn = await client.connect();
        const res2 = await conn.query('SELECT * FROM products WHERE id = $1',[pdt.id])
        conn.release();
        expect(res2.rowCount).toBe(0);

    })
})