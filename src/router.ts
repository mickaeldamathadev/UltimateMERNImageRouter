import crypto from 'crypto'
import { Router } from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import path from 'path'

mongoose.connect(process.env.MONGO_URI)
const conn = mongoose.connection

// Init gfs
let gfs: mongoose.mongo.GridFSBucket
conn.once('open', () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  })
})

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        }
        resolve(fileInfo)
      })
    })
  },
})
export const uploadMiddleware = multer({ storage })

export default Router()
  .post('/', uploadMiddleware.single('file'), (req, res) => {
    res.json({ file: req.file })
  })
  .get('/:filename', (req, res) => {
    gfs
      .find({ filename: req.params.filename })
      .toArray()
      .then((files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: 'No files exist',
          })
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res)
      })
      .catch((err) => {
        res.status(404).json({
          err: 'No files found',
        })
      })
  })
