import {Product_Manager, Product} from '../models/products'
import express, {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
const manager = new Product_Manager()

const index = async (_req: Request, res: Response) => {
  const products = await manager.index()
  res.json(products)
}

const show = async (req: Request, res: Response) => {
   const product = await manager.show(req.body.id)
   res.json(product)
}

const create = async (req: Request, res: Response) => {
    try {
        const order: Product = {
            id:0,
            name: req.body.name,
            price: req.body.price,
        }

        const newProduct= await manager.create(order)
        res.json(newProduct)
    } catch(err) {
      console.log('wwwwwwwwwwwwwwww')

        res.status(400)
        res.send(`couldn't create product Error: ${err}`)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await manager.delete(req.body.id)
    res.json(deleted)
}

const verify = async (req:Request,res:Response, next:NextFunction) =>{
  if(!req.headers.authorization){
      res.send('Authorization token not provided');
      return;

    }
    const token = req.headers.authorization.split(' ')[1];
     
    if(process.env.TOKEN_SECRET){
    try{
        jwt.verify(token,process.env.TOKEN_SECRET);

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
const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', [verify, create])
  app.delete('/products', destroy)
}

export default productRoutes