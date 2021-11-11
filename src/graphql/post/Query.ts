import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import post from './sql/post.sql'
import searchPosts from './sql/searchPosts.sql'

export const FeedOrderBy = {
  CREATION_TIME: 'creation_time',
}

export const Query: QueryResolvers<ApolloContext> = {
  post: async (_, { id }) => {
    const { rows } = await poolQuery(post, [id])
    return rows[0]
  },

  posts: async (_, { id, pagination }) => {
    const { rows } = await poolQuery(searchPosts, [id, pagination.limit])
    return rows
  },

  searchPosts: async (_, { keywords }) => {
    const { rows } = await poolQuery(searchPosts, [keywords])
    return rows
  },
}
