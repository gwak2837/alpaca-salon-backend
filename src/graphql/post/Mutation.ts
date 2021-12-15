import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { MutationResolvers } from '../generated/graphql'
import { PostCategory } from './Object'
import createPost from './sql/createPost.sql'
import deletePost from './sql/deletePost.sql'
import updatePost from './sql/updatePost.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  createPost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(createPost, [
      input.category ?? PostCategory.UNDEFINED,
      input.title,
      input.contents,
      input.imageUrls?.map((imageUrl) => imageUrl.href),
      userId,
    ])

    return graphqlRelationMapping(rows[0], 'post')
  },

  updatePost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(updatePost, [
      input.category,
      input.title,
      input.contents,
      input.id,
      input.imageUrls,
      userId,
    ])
    if (rowCount === 0)
      throw new UserInputError(
        `id:${input.id} 의 게시글이 존재하지 않거나, 해당 게시글의 작성자가 아닙니다.`
      )

    return graphqlRelationMapping(rows[0], 'post')
  },

  deletePost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(deletePost, [id, userId])
    if (rowCount === 0) throw new UserInputError(`id:${id} 의 게시글이 존재하지 않습니다.`)

    return graphqlRelationMapping(rows[0], 'post')
  },
}
