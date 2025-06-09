import redisClient from '~/services/redis.services'

export function generateOTP(length = 6): string {
  const otp = Math.floor(Math.random() * 1000000)
  return otp.toString().padStart(length, '0')
}

export async function storeOTP(phoneNumber: string, otp: string): Promise<void> {
  await redisClient.set(process.env.OTP_KEY + phoneNumber, otp, { EX: 300 })
}

export async function getOTP(phoneNumber: string): Promise<string | null> {
  return await redisClient.get(process.env.OTP_KEY + phoneNumber)
}
