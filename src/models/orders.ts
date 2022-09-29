import client from '../client'
export type Order = {
    id:number,
    user_id:number
    complete:boolean
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


            const connect =await client.connect();
            const query = "INSERT INTO orders( user_id, complete) VALUES($1,$2) RETURNING *";
            const result = await connect.query(query,[pd.user_id, pd.complete]);
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

    async orders_from_user(id:string):Promise<{order_id:number,id:number,complete:boolean,product_id:number,quantity:number,user_id:number}[]>{
        try {
            const connect =await client.connect();           
            const query = "SELECT  orders.id,orders.user_id, orders.complete, order_products.product_id, order_products.quantity FROM order_products INNER JOIN orders ON order_products.order_id = orders.id WHERE orders.user_id = $1";
            const result = await connect.query(query,[parseInt(id)]);
            connect.release();  
            return result.rows;
         }catch(err){
            throw new Error(`Cannot fetch Order with id = ${id} Error: ${err}`);
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    }

    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
        try {
          const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
          //@ts-ignore
          const conn = await Client.connect()
    
          const result = await conn
              .query(sql, [quantity, orderId, productId])
    
          const order = result.rows[0]
    
          conn.release()
    
          return order
        } catch (err) {
          throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
      }
    
    
}
