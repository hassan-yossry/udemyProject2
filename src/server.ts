import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import productRoutes from './handlers/product'
import userRoutes from './handlers/user'
import orderRoutes from './handlers/order'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})
    const server = app.listen(3001, function () {
        console.log(`starting app on: ${address}`)
    })

export default app;
export {server}