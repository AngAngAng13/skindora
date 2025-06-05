import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { app, server } from './lib/socket'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'

config()
const swaggerDocument = YAML.load(path.join(__dirname, './openAPI.yml'))

const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

databaseService.connect().then(() => {
  databaseService.indexUsers()
})

app.get('/', (req, res) => {
  res.send('hello skindora develop branch')
})

app.use('/users', usersRouter)
app.use('/payment', paymentsRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(defaultErrorHandler)

server.listen(port, () => {
  console.log(`Skindora server is running on port ${port}`)
})
