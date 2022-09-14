import client from '../client'
export type Order = {
    id:number,
    product_id:number,
    user_id:number
    complete:boolean,
    quantity:number
}

export class Order_Manager{
    async  index():Promise<Order[]> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM orders";
            const result = await connect.query(query);
            connect.release();
            return result.rows;
        }catch(err){
            throw new Error(`Cannot get order results ${err}`)
        }
    }
    async  show(id:string):Promise<Order> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM orders WHERE id = $1";
            const result = await connect.query(query,[id]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot get order with id = ${id} Error ${err}`)
        }
    }
    async  create(pd:Order):Promise<Order> {
        try{
            console.log(pd)

            const connect =await client.connect();
            const query = "INSERT INTO orders(product_id, user_id, complete, quantity) VALUES($1,$2,$3,$4) RETURNING *";
            const result = await connect.query(query,[pd.product_id,pd.user_id, pd.complete, pd.quantity]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot Create New Order Error: ${err}`);
        }
    }
    async  delete(id:string):Promise<Order> {
        try{
            const connect =await client.connect();
            const query = "DELETE FROM orders WHERE id = $1";
            const result = await connect.query(query,[id]);
            connect.release();                                                                                                                                                                                                                                                              
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot delete Order with id = ${id} Error: ${err}`);
        }
    
    }

    async orders_from_user(id:string):Promise<Order[]>{
        try {
            const connect =await client.connect();
            const query = "SELECT FROM orders WHERE user_id = $1";
            const result = await connect.query(query,[id]);
            connect.release();                                                                                                                                                                                                                                                              
            return result.rows;
         }catch(err){
            
            throw new Error(`Cannot delete Order with id = ${id} Error: ${err}`);
            
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    }
    
    
}
//const tst= new Order_Manager();
//console.log('hi')
//tst.create({id:0, user_id:2,product_id:2,complete:true,quantity:1}).then(res=>console.log(res))
//tst.index().then(res => console.log(res))