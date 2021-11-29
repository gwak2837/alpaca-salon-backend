import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { commentORM } from './ORM'
import commentsByPost from './sql/commentsByPost.sql'

export const Query: QueryResolvers<ApolloContext> = {
  commentsByPost: async (_, { postId }, { userId }) => {
    const { rows } = await poolQuery(commentsByPost, [postId, userId])

    return commentORM(rows)
  },
}
