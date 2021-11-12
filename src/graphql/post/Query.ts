import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import post from './sql/post.sql'
import posts from './sql/posts.sql'
import searchPosts from './sql/searchPosts.sql'

// export const FeedOrderBy = {
//   CREATION_TIME: 'creation_time',
// }

export const Query: QueryResolvers<ApolloContext> = {
  post: async (_, { id }) => {
    const { rows } = await poolQuery(post, [id])
    return graphqlRelationMapping(rows[0], 'post')
  },

  posts: async (_, { pagination }) => {
    const { rows } = await poolQuery(posts, [pagination.lastId, pagination.limit])
    return rows.map((row) => graphqlRelationMapping(row, 'post'))
  },

  searchPosts: async (_, { keywords }) => {
    const { rows } = await poolQuery(searchPosts, [keywords])
    return rows.map((row) => graphqlRelationMapping(row, 'post'))
  },
}
