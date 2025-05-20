import express from 'express'
const app = express()
const port = 4000
app.get('/', (req, res) => {
  res.send('hello skindora')
})

app.listen(port, () => {
  console.log(`Skindora đang chạy trên port ${port}`)
})
