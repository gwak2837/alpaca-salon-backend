import { Pool } from 'pg'

import { DatabaseQueryError } from '../apollo/errors'
import { formatDate } from '../utils'

export const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,

  ...(process.env.NODE_ENV === 'production' &&
    process.env.GIT_BRANCH !== 'main' && {
      ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----\n${process.env.CA_CERTIFICATE}\n-----END CERTIFICATE-----`,
        checkServerIdentity: () => {
          return undefined
        },
      },
    }),
})

export async function poolQuery(sql: string, values?: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(formatDate(new Date()), '-', sql, values)
  }

  return pool.query(sql, values).catch((error) => {
    if (process.env.NODE_ENV === 'production') {
      console.error(error.message)
      console.error(sql, values)
      throw new DatabaseQueryError('Database query error')
    } else {
      throw new DatabaseQueryError(error)
    }
  })
}
