import { CommentResolvers } from '../generated/graphql'

export const Comment: CommentResolvers = {
  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
  isModified: ({ isModified }) => {
    return !!isModified
  },
  user: ({ user }) => {
    return user?.id ? user : null
  },
}
