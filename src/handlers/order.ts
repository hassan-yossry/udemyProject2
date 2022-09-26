import {Order_Manager, Order} from '../models/orders'
import {User} from '../models/users'
import express, {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
const manager = new Order_Manager()

const index = async (_req: Request, res: Response) => {
  try{
     const Orders = await manager.index()
     res.json(Orders)
  }catch(err){
    res.status(400)
    res.json(err)

  }
  

}

const show = async (req: Request, res: Response) => {
  try{
    const order = await manager.show(req.params.id)
    res.json(order)
  }catch(err){
    res.status(400)
    res.json(err)
  }

}

const create = async (req: Request, res: Response) => {
    try {
      


        const order: Order = {
            id:0,
            user_id: req.body.user_id,
            complete: req.body.complete
        }

        const newOrder= await manager.create(order)

        res.send(newOrder);
    } catch(err) {

        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
   try{
    const deleted = await manager.delete(req.body.id)
    res.json(deleted)
   }catch(err){
    res.status(400).send(`Couldn't delete user ${err}`)
   }
}
const list_orders = async (req:Request, res: Response) =>{
    try{
        const result = await manager.orders_from_user(req.params.uid);
        
        res.send(result)
    }catch(err){
        res.status(400).send(`couldn't fetch results ${err}`)
    }
}
const verify = async (req:Request,res:Response, next:NextFunction) =>{

    if(!req.headers.authorization){
        res.status(400).send('Authorization token not provided');
        return;
  
      }
      const token = req.headers.authorization.split(' ')[1];
       
      if(process.env.TOKEN_SECRET){
      try{
          const decoded = jwt.verify(token,process.env.TOKEN_SECRET) as User;

          if(decoded.id !== parseInt(req.params.uid)){
            throw new Error("wrong id")
          }

  
      }catch(err){
          res.status(401).send(`Acess Denied : invalid token ${err}`)
          return;
      }
    }else{
        res.status(400).send('no token secret!')
        return;
    }
    next()
}
const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/orders/:id', show)
  app.get('/orders/user/:uid',[verify,list_orders])
  app.post('/orders', create)
  app.delete('/orders', destroy)
}

const addProduct = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id
    const productId: string = _req.body.productId
    const quantity: number = parseInt(_req.body.quantity)
  
    try {
      const addedProduct = await manager.addProduct(quantity, orderId, productId)
      res.json(addedProduct)
    } catch(err) {
      res.status(400)
      res.json(err)
    }
  }

export default orderRoutes