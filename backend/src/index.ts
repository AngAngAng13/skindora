import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { app, server} from './lib/socket'

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

server.listen(port, ()=>{
  console.log(`Socket.io server is running on port ${port}`)
})
