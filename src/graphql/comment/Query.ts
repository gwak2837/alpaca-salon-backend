import { AuthenticationError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { commentORM } from './ORM'
import commentsByPost from './sql/commentsByPost.sql'

export const Query: QueryResolvers<ApolloContext> = {
  commentsByPost: async (_, { postId }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(commentsByPost, [postId, userId])

    console.log('👀 - commentORM(rows)', commentORM(rows))
    return commentORM(rows)
  },
}
