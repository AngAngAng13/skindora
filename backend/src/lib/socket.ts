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
  if (role === 'staff') {
    emitOnlineStaff()
  }

  //start chat event
  //customer là người start chat
  socket.on('startChat', () => {
    if (role !== 'customer') return
    if (socket.data.pairedUserId) {
      console.log(`Customer ${userId} is already in a chat with ${socket.data.pairedUserId}`)
      return
    }
    //chọn ngẫu nhiên 1 staff online
    const staffId = pickAvailableStaff()
    if (!staffId) {
      console.log('No available staff to chat')
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

  //send message event
  socket.on('sendMessage', (recipientId: string, message: string) => {
    const recipientSocket = io.sockets.sockets.get(userSocketMap[recipientId])
    //Nếu reipient không online
    if (!recipientSocket) {
      console.log(`Recipient ${recipientId} is not connected`)
      return
    }

    //Nếu là customer mà recipient khác user đã paired
    if (socket.data.role === 'customer' && socket.data.pairedUserId !== recipientId) {
      console.log(`Customer ${socket.data.userId} is not paired with ${recipientId}`)
      return
    }

    //Nếu là staff mà recipient không nằm trong list pairedCustomerIds
    if (socket.data.role === 'staff' && !socket.data.pairedCustomerIds?.includes(recipientId)) {
      console.log(`Staff ${socket.data.userId} is not paired with ${recipientId}`)
      return
    }

    //Gửi message đến recipient
    recipientSocket.emit('receiveMessage', message, socket.data.userId)
  })

  //disconnect event
  socket.on('disconnect', () => {
    delete userSocketMap[socket.data.userId]
    console.log(`User disconnected with id: ${socket.id}, userId: ${socket.data.userId}, role: ${socket.data.role}`)

    //Cập nhật list online staff
    emitOnlineStaff()

    if (socket.data.role === 'staff' && socket.data.pairedCustomerIds && socket.data.pairedCustomerIds?.length > 0) {
      socket.data.pairedCustomerIds.forEach((customerId) => {
        const customerSocket = io.sockets.sockets.get(userSocketMap[customerId])
        if (customerSocket) {
          customerSocket.data.pairedUserId = undefined
          customerSocket.emit('chatEnded', socket.data.userId)
        }
      })
    }

    if (socket.data.role === 'customer' && socket.data.pairedUserId) {
      const staffSocket = io.sockets.sockets.get(userSocketMap[socket.data.pairedUserId])
      if (staffSocket) {
        staffSocket.data.pairedCustomerIds =
          staffSocket.data.pairedCustomerIds?.filter((id) => id !== socket.data.userId) || []
        staffSocket.emit('chatEnded', socket.data.userId)
      }
    }
  })
})

function pickAvailableStaff(): string | null {
  if (onlineStaffIds.length === 0) {
    console.log('No available staff online')
    return null
  }

  //Chọn staff đang paired với ít customer nhất
  const sortStaffList = onlineStaffIds.sort((a, b) => {
    const aSocket = io.sockets.sockets.get(userSocketMap[a])
    const bSocket = io.sockets.sockets.get(userSocketMap[b])
    return (aSocket?.data.pairedCustomerIds?.length || 0) - (bSocket?.data.pairedCustomerIds?.length || 0)
  })

  //Chọn staff đầu tiên
  return sortStaffList[0] || null
}

function emitOnlineStaff() {
  onlineStaffIds = Object.keys(userSocketMap).filter((id) => {
    const userSocket = io.sockets.sockets.get(userSocketMap[id])
    return userSocket?.data.role === 'staff'
  })
  io.emit('getOnlineStaff', onlineStaffIds)
}

export { io, server, app }
