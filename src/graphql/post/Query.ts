import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { buildSelect } from '../../utils/sql'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import { postORM } from './ORM'
import famousPosts from './sql/famousPosts.sql'
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
    let sql = posts
    const values = [pagination.limit]

    // Pagination
    if (pagination.lastId) {
      sql = buildSelect(sql, 'WHERE', 'post.id < $1')
      values.push(pagination.lastId)
    }

    const { rows } = await poolQuery(sql, values)
    return rows.map((row) => postORM(row))
  },

  searchPosts: async (_, { keywords }) => {
    const { rows } = await poolQuery(searchPosts, [keywords])
    return rows.map((row) => graphqlRelationMapping(row, 'post'))
  },

  famousPosts: async () => {
    const { rows } = await poolQuery(famousPosts, [new Date(2021, 10, 1)])
    return rows.map((row) => graphqlRelationMapping(row, 'post'))
  },
}
