import client from '../client'
import bcrypt from 'bcrypt'
export type User= {
    id:number,
    first_name:string,
    last_name:string,
    password:string
}
export class User_Manager{
    pepper: string = 'this is default';
    saltings: string = '10';
    constructor(){
        if(process.env.SECRET_KEY)
         this.pepper = process.env.SECRET_KEY;
        if(process.env.SALT_ROUNDS)
         this.saltings = process.env.SALT_ROUNDS
    }
    async  index():Promise<User[]> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM users";
            const result = await connect.query(query);
            connect.release();
            return result.rows;
        }catch(err){
            throw new Error(`Cannot get users results ${err}`)
        }
    }
    async  show(id:string):Promise<User> {
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM users WHERE id = $1";
            const result = await connect.query(query,[id]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot get order with id = ${id} Error ${err}`)
        }
    }
    async  create(pd:User):Promise<User> {
        try{
            const connect =await client.connect();
            const query1 = 'SELECT FROM users WHERE first_name = $1 AND last_name = $2'
            const chk = await connect.query(query1,[pd.first_name,pd.last_name])
            if(chk.rowCount>0)throw new Error("User Already Exists!")
            const hash  = bcrypt.hashSync(pd.password+this.pepper,parseInt(this.saltings))
            const query = "INSERT INTO users(first_name, last_name, password) VALUES($1,$2,$3) RETURNING *";
            const result = await connect.query(query,[pd.first_name,pd.last_name,hash]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot Create New User: ${err}`);
        }
    }
    async  delete(id:string):Promise<User> {
        try{
            const connect =await client.connect();
            const query = "DELETE FROM orders WHERE user_id = $1";
            const query2= "DELETE FROM users WHERE id = $1"
            await connect.query(query,[id]);
            const result = await connect.query(query2,[id]);
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot delete users with id = ${id} Error: ${err}`);
        }
    }

    async authenticate(u:User){
        try{
            const connect =await client.connect();
            const query = "SELECT * FROM users WHERE first_name = ($1)";
            const result = await connect.query(query,[u.first_name]);
            if(result.rows.length === 0){
                connect.release();
                throw new Error("User doesn't exists")
            }
            if(!bcrypt.compareSync(u.password+this.pepper,result.rows[0].password)){
                connect.release();
                throw new Error("Incorrect Password!")
            }
            connect.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot authenticate user Error: ${err}`)
        }
    }
}

//const tst = new User_Manager();
//tst.create({id:0, first_name:"soka",last_name:"yossry",password:"sus"})
//tst.index().then((res)=>console.log(res))
//tst.authenticate({id:0,first_name:"hassan",last_name:"yossry",password:"sus"}).then((res)=>console.log(res))
//tst.delete("8").then(res=>console.log(res))