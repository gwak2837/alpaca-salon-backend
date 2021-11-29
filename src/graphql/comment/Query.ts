import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { commentORM } from './ORM'
import commentsByPost from './sql/commentsByPost.sql'

export const Query: QueryResolvers<ApolloContext> = {
  commentsByPost: async (_, { postId }, { userId }) => {
    const { rows } = await poolQuery(commentsByPost, [
      postId,
      '5349fcd3-264b-4f26-9203-f80f6ec6a8b5',
    ])

    return commentORM(rows)
  },
}
