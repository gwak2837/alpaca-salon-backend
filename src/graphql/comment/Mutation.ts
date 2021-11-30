import { AuthenticationError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { Comment, MutationResolvers } from '../generated/graphql'
import toggleLikingComment from './sql/toggleLikingComment.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  toggleLikingComment: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(toggleLikingComment, [userId, id])

    return { id, isLiked: rows[0].result, likedCount: rows[0].liked_count } as Comment
  },

  createComment: async (_, { postId, commentId }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')
    return {} as Comment
  },
}
