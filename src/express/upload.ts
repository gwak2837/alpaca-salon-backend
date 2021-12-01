import { Storage } from '@google-cloud/storage'
import express, { Express } from 'express'
import Multer from 'multer'

import { bucketName } from '../utils/constants'

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
})

const bucket =
  process.env.NODE_ENV === 'production'
    ? new Storage().bucket(bucketName)
    : new Storage({
        projectId: 'alpaca-salon',
        keyFilename: './src/express/alpaca-salon-8482a52cd70c.json',
      }).bucket(bucketName)

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage
export function setFileUploading(app: Express) {
  app.use(express.json())

  app.post('/upload', multer.single('file'), (req, res, next) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream()

    blobStream.on('error', (err) => {
      next(err)
    })

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      res.status(200).send(publicUrl)
    })

    blobStream.end(req.file.buffer)
  })
}
