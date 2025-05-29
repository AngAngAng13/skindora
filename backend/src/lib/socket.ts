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

  //emit online staff khi có staff connected
  if(role === 'staff'){
    onlineStaffIds = Object.keys(userSocketMap).filter((id)=>{
      const userSocket = io.sockets.sockets.get(userSocketMap[id])
      return userSocket?.data.role === 'staff'
    })
    io.emit('getOnlineStaff', onlineStaffIds)
  }

  //start chat event
  //customer là người start chat
  socket.on('startChat', ()=>{
    if(role !== 'customer') return
    if(socket.data.pairedUserId){
      console.log(`Customer ${userId} is already in a chat with ${socket.data.pairedUserId}`)
      return
    }
    //chọn ngẫu nhiên 1 staff online
    const staffId = pickAvailableStaff()
    if(!staffId){
      console.log("No available staff to chat")
      return
    }
    console.log(`Customer ${userId} is paired with staff ${staffId}`)
    const staffSocket = io.sockets.sockets.get(userSocketMap[staffId])
    if (!staffSocket || staffSocket.data.role !== 'staff') {
      console.log(`Staff ${staffId} is not available`)
      return
    }

    socket.data.pairedUserId = staffId
    //Gán pairedUserId cho staffSocket
    staffSocket.data.pairedUserId = socket.data.userId
    //Gán customerId vào list nếu chưa có
    staffSocket.data.pairedCustomerIds = staffSocket.data.pairedCustomerIds || []
    if (!staffSocket.data.pairedCustomerIds.includes(socket.data.userId)) {
      staffSocket.data.pairedCustomerIds.push(socket.data.userId)
    }

    socket.emit('chatStarted', staffId)
    staffSocket.emit('chatStarted', socket.data.userId)
  })
})

function pickAvailableStaff(): string | null {
  if(onlineStaffIds.length === 0){
    console.log("No available staff online")
    return null
  }

  //Chọn staff đang paired với ít customer nhất
  const sortStaffList = onlineStaffIds.sort((a,b)=>{
    const aSocket = io.sockets.sockets.get(userSocketMap[a])
    const bSocket = io.sockets.sockets.get(userSocketMap[b])
    return (aSocket?.data.pairedCustomerIds?.length || 0) - (bSocket?.data.pairedCustomerIds?.length || 0)
  })

  //Chọn staff đầu tiên
  return sortStaffList[0] || null
}

export { io, server, app }
