import { Storage } from '@google-cloud/storage'
import { Express } from 'express'

import { bucketName } from '../utils/constants'

const bucket = new Storage().bucket(bucketName)

export function setFileUploading(app: Express) {
  app.get('/upload', async (req, res) => {
    const filePath = ''
    const destFileName = ''

    await bucket.upload(filePath, {
      destination: destFileName,
    })

    const fileUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    res.send(fileUrl)
    console.log(`${filePath} uploaded to ${fileUrl}`)
  })
}
