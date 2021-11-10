import { AuthenticationError } from 'apollo-server-express'

import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import isUniqueNameUnique from './sql/isUniqueNameUnique.sql'
import me from './sql/me.sql'

export const Query: QueryResolvers<ApolloContext> = {
  me: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const sql = me
    const values = [userId]

    const { rows } = await poolQuery(sql, values)

    return graphqlRelationMapping(rows[0], 'user')
  },

  isUniqueNameUnique: async (_, { uniqueName }) => {
    const { rowCount } = await poolQuery(isUniqueNameUnique, [uniqueName])

    return rowCount === 0
  },
}
