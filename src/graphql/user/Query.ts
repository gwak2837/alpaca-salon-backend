import { AuthenticationError, UserInputError } from 'apollo-server-express'

import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import isNicknameUnique from './sql/isNicknameUnique.sql'
import me from './sql/me.sql'
import userByNickname from './sql/userByNickname.sql'

export const Query: QueryResolvers<ApolloContext> = {
  me: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const { rows } = await poolQuery(me, [userId])

    return graphqlRelationMapping(rows[0], 'user')
  },

  isNicknameUnique: async (_, { nickname }) => {
    const { rowCount } = await poolQuery(isNicknameUnique, [nickname])

    return rowCount === 0
  },

  userByNickname: async (_, { nickname }) => {
    const { rowCount, rows } = await poolQuery(userByNickname, [nickname])

    if (rowCount === 0)
      throw new UserInputError(`nickname: ${nickname} 의 사용자를 찾을 수 없습니다.`)

    return graphqlRelationMapping(rows[0], 'user')
  },
}
