import { MongoClient } from 'mongodb'
import fs from 'fs'

let uri = process.env.DATABASE_URL ? process.env.DATABASE_URL : process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

let mongoCertPath = `${__dirname}/ca-certificate.crt`

if (process.env.CA_CERT) {
  fs.writeFileSync(mongoCertPath, process.env.CA_CERT)
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  let config = {}
  if (process.env.CA_CERT) {
    config['sslCA'] = mongoCertPath
  }

  const client = await MongoClient.connect(uri, config)
  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}