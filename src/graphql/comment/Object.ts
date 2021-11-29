import { CommentResolvers } from '../generated/graphql'

export const Comment: CommentResolvers = {
  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
