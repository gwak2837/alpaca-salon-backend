import { Storage } from '@google-cloud/storage'
import { Express } from 'express'

import { bucketName } from '../utils/constants'

const bucket = new Storage(/* {
  projectId: 'alpaca-salon',
  keyFilename: './src/express/alpaca-salon-8482a52cd70c.json',
} */).bucket(bucketName)

export function setFileUploading(app: Express) {
  app.get('/upload', async (req, res) => {
    const filePath = 'dist/index.js.LICENSE.txt'
    const destFileName = `index.js.LICENSE-${new Date().getTime()}.txt`

    await bucket.upload(filePath, {
      destination: destFileName,
    })

    const fileUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    res.send(fileUrl)
    console.log(`${filePath} uploaded to ${fileUrl}`)
  })
}
