import { AuthenticationError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { MutationResolvers } from '../generated/graphql'
import updatePost from './sql/updatePost.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  updatePost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(updatePost, [
      input.category,
      input.title,
      input.contents,
      input.id,
      userId,
    ])

    if (rowCount === 0) return null

    return graphqlRelationMapping(rows[0], 'post')
  },
}
