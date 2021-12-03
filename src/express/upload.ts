import { Storage } from '@google-cloud/storage'
import express, { Express } from 'express'
import Multer from 'multer'

import { sha128 } from '../utils'
import { bucketName } from '../utils/constants'

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10_000_000, // no larger than 10MB, you can change as needed.
  },
})

const bucket = new Storage(
  process.env.NODE_ENV === 'production'
    ? undefined
    : {
        projectId: 'alpaca-salon',
        keyFilename: './src/express/alpaca-salon-8482a52cd70c.json',
      }
).bucket(bucketName)

function uploadFileToGoogleCloudStorage(file: Express.Multer.File) {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now() + sha128(file.originalname)}.${file.mimetype.split('/')[1]}`
    const blobStream = bucket.file(fileName).createWriteStream()

    blobStream.on('error', (err) => {
      reject(err)
    })

    blobStream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`)
    })

    blobStream.end(file.buffer)
  })
}

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage
export function setFileUploading(app: Express) {
  app.use(express.json())

  app.post('/upload', multer.array('images'), (req, res, next) => {
    const files = req.files as Express.Multer.File[]

    if (!files) {
      return res.status(400).send('No file uploaded.')
    }

    Promise.all(files.map((file) => uploadFileToGoogleCloudStorage(file)))
      .then((imageUrls) => res.status(200).json({ imageUrls }))
      .catch((err) => {
        next(err)
        console.error(err)
        res.status(500).send('File upload failed.')
      })
  })
}
