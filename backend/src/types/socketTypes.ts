export interface ServerToClientEvents {
  receiveMessage: (message: string, senderId: string) => void;
  getOnlineStaff: (staffIds: string[]) => void;
  chatStarted: (pairedUserId: string) => void;
  chatEnded: (pairedUserId: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (recipientId: string, message: string) => void;
  startChat: () => void;
  endChat: () => void;
  ackMessage: (messageId: string, callback: (success: boolean) => void) => void;
}

export interface InterServerEvents {
  broadcastMessage: (
    recipientId: string,
    message: string,
    senderId: string
  ) => void;
  syncChatSession: (
    userId: string,
    pairedUserId: string | null,
    action: "start" | "end" 
  ) => void;
}

export interface SocketData {
  userId: string;
  role: "customer" | "staff";
  pairedUserId?: string;
  pairedCustomerIds?: string[];
}