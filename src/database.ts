import Mongoose from 'mongoose'

const conn = Mongoose.createConnection(
  process.env.MONGO_URI || 'mongo://localhost:27017',
)

process.on('exit', () => {
  conn.close()
})

process.on('SIGINT', () => {
  conn.close().then(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  conn.close().then(() => {
    process.exit(1)
  })
})

process.on('SIGUSR1', () => {
  conn.close().then(() => {
    process.exit(1)
  })
})

process.on('SIGUSR2', () => {
  conn.close().then(() => {
    process.exit(1)
  })
})
