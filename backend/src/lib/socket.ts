import { Server, Socket } from 'socket.io'
import http from 'http'
import express, { Application } from 'express'
import { config } from 'dotenv'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '~/types/socketTypes'
config()

const app: Application = express()
const server = http.createServer(app)

//Set up server
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: [process.env.FRONTEND_URL as string, 'http://localhost:5173']
  }
})

interface UserSocketMap {
  [userId: string]: string
}

//Map userId với socketId
const userSocketMap: UserSocketMap = {}
let onlineStaffIds: string[] = []

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
  const { userId, role } = socket.handshake.query as { userId: string; role: 'customer' | 'staff' }
  if (!userId || !['customer', 'staff'].includes(role)) {
    socket.disconnect(true)
    return
  }
  socket.data.userId = userId
  socket.data.role = role
  userSocketMap[userId] = socket.id

  console.log(`[${role}] ${userId} connected`)
})

export { io, server, app }
