import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { MutationResolvers } from '../generated/graphql'
import createPost from './sql/createPost.sql'
import deletePost from './sql/deletePost.sql'
import updatePost from './sql/updatePost.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  likeComment: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(createPost, [])

    return graphqlRelationMapping(rows[0], 'post')
  },

  createComment: async (_, { postId, commentId }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(updatePost, [])
    if (rowCount === 0) return null

    return graphqlRelationMapping(rows[0], 'post')
  },
}
