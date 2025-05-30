import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'

config()
const app = express()
const port = process.env.PORT
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.indexUsers()
})

app.get('/', (req, res) => {
  res.send('hello skindora develop branch')
})

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Skindora đang chạy trên port ${port}`)
})
