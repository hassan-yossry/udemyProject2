import {Pool} from 'pg';
import dotenv from 'dotenv'
import path from 'path'
const result=dotenv.config({path:path.join(__dirname,'../.env')})
if(result.error){
    throw Error("No config")
}
const 
{   ENV,
    PG_HOST,
    PG_USER,
    PG_PASSWORD,
    PG_DB,
    PG_DB_TEST
    
} = process.env
let client:Pool;
if(ENV === "dev")
{
       client = new Pool({
        host:PG_HOST,
        password:PG_PASSWORD,
        user:PG_USER,
        database:PG_DB
    
    })
}else{
    client = new Pool({
        host:PG_HOST,
        password:PG_PASSWORD,
        user:PG_USER,
        database:PG_DB_TEST
    
})}


export default client;