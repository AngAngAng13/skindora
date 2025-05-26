import { createClient } from 'redis'
import { config } from 'dotenv'

config()
const host: string = process.env.HOST_IP || ''
const port: number = Number(process.env.HOST_REDIS_PORT) || 6379

const redisClient = createClient({
  socket: {
    host,
    port
  },
  password: process.env.HOST_PASSWORD || ''
})

redisClient.on('error', (err) => {
  console.log('Redis connect error: ', err)
})

;(async () => {
  await redisClient.connect()
})() // connect redis ngay lập tức

export default redisClient
