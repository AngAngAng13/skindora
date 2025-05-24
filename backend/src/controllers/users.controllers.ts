import { Request, Response } from 'express'
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'demo@gmail.com' && password === '123456') {
    res.json({
      data: [{ name: 'demo', email: 'demo@gmail.com' }]
    })
  } else {
    res.status(400).json({
      error: 'login failed'
    })
  }
}
