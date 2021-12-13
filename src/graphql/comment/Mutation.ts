import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import { QueryArrayResult } from 'pg'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { Comment, MutationResolvers } from '../generated/graphql'
import checkCommentInPost from './sql/checkCommentInPost.sql'
import createComment from './sql/createComment.sql'
import deleteComment from './sql/deleteComment.sql'
import toggleLikingComment from './sql/toggleLikingComment.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  toggleLikingComment: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(toggleLikingComment, [userId, id])

    return { id, isLiked: rows[0].result, likedCount: rows[0].liked_count } as Comment
  },

  createComment: async (_, { postId, contents, commentId }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    if (commentId) {
      const { rowCount } = await poolQuery(checkCommentInPost, [postId, commentId])
      if (rowCount === 0)
        throw new UserInputError(
          `postId: ${postId}, commentId: ${commentId} 에 해당하는 댓글에 대댓글을 작성할 수 없습니다.`
        )
    }

    const { rows } = await poolQuery(createComment, [contents, postId, userId, commentId])

    return { id: rows[0].id } as Comment
  },

  deleteComment: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const results = await poolQuery(deleteComment, [id, userId])

    return { id: results.rows[0].deleted_comment_id } as Comment
  },
}
