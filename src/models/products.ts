import client from '../client'
export type Product = {
    id:number,
    name:string,
    price:number
}

export class Product_Manager{
    async  index():Promise<Product[]> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM products";
            const result = await connect.query(query);
            connect.release();
            return result.rows;
        }catch{
            throw new Error('Cannot get Product results')
        }
    }
    async  show(id:string):Promise<Product> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM products WHERE id = $1";
            const result = await connect.query(query,[id]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot get Product with id = ${id} Error ${err}`)
        }
    }
    async  create(pd:Product):Promise<Product> {
        
        try{
            const connect =await client.connect();
            const query1 = "SELECT * FROM products WHERE name = $1"
            const chk = await connect.query(query1,[pd.name]);
            if(chk.rows.length>0) throw new Error(`Product ${pd.name} already exists!`)

            const query = "INSERT INTO products(name, price) VALUES($1,$2) RETURNING *";
            const result = await connect.query(query,[pd.name,pd.price]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot Create New Product Error: ${err}`);
        }
    }
    async  delete(id:string):Promise<Product> {
        try{
            const connect =await client.connect();
            const query = "DELETE FROM products WHERE id = $1";
            const result = await connect.query(query,[id]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot delete product with id = ${id} Error: ${err}`);
        }
    }
}
//const tst = new Product_Manager();
//tst.create({id:0, name:"tv",price:10})
