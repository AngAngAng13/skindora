import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { app, server} from './lib/socket'
import cartRouter from './routes/cart.routes'

config()
const port = process.env.PORT
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.indexUsers()
})

app.get('/', (req, res) => {
  res.send('hello skindora develop branch')
})

app.use('/users', usersRouter)
app.use('/carts', cartRouter)

app.use(defaultErrorHandler)

server.listen(port, ()=>{
  console.log(`Skindora server is running on port ${port}`)
})
