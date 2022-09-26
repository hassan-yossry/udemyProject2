import {User_Manager, User} from '../models/users'
import express, {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
const manager = new User_Manager()

const index = async (req: Request, res: Response) => {
    if(!req.headers.authorization){
        res.send('Authorization token not provided');
        return;
  
    }
    const token = req.headers.authorization.split(' ')[1];
  
    if(process.env.TOKEN_SECRET){
        try{
            jwt.verify(token,process.env.TOKEN_SECRET);
            
    
        }catch(err){
            res.status(401).send(`Acess Denied : invalid token`)
            return;
        }
    

        const users = await manager.index()
        res.json(users)
        return
    }else{
        res.status(401).send('no token secret!');
        return;
    }


}

const show = async (req: Request, res: Response) => {
   
   
        try{
            const user = await manager.show(req.params.id)

            res.json(user)
            return
    
        }catch(err){
            res.status(400).send(`Couldn't show user with id ${req.params.id} ${err}`)
            return;
        }
    

        
  
}


const create = async (req: Request, res: Response) => {
     try {
        const user: User = {
            id:0,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        }

        const newUser= await manager.create(user)
        if(process.env.TOKEN_SECRET){
            const token = jwt.sign(newUser,process.env.TOKEN_SECRET as string);
            res.send({'token':token});
            return;
        }
        throw new Error('Token secret not provided')


    } catch(err) {
        res.status(400)
        res.json(err)
        return;
    }
}

const authenticate = async (req: Request, res: Response)=>{
    try{
        
        const user = await manager.authenticate({id:0, first_name:req.body.first_name,last_name:req.body.last_name,password:req.body.password});
        
        if(process.env.TOKEN_SECRET){

            const token = jwt.sign(user,process.env.TOKEN_SECRET);
            res.send({'token':token});
            return;
        }
        throw new Error('Token secret not provided')
    }
    catch(err){
    

        res.status(401).send(`Couldn't authenticate user ${err}`)
    }
}
const destroy = async (req: Request, res: Response) => {
    try{
        const deleted = await manager.delete(req.body.id)
        res.send(deleted)
    }catch(err){
        res.status(400).send( `Couldn't delete a user with id ${req.body.id} Error: ${err}`)
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
const userRoutes = (app: express.Application) => {
  app.post('/users/login/', [authenticate])
  app.get('/users', [verify,index])
  app.get('/users/:id', [verify,show])
  app.post('/users', [verify,create])
  app.delete('/users', [verify,destroy])
}

export default userRoutes;