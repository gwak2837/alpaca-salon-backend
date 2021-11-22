import { AuthenticationError } from 'apollo-server-express'
import fetch from 'node-fetch'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { MutationResolvers } from '../generated/graphql'
import getUserKakaoId from './sql/getUserKakaoId.sql'
import logout from './sql/logout.sql'
import unregister from './sql/unregister.sql'
import updateUser from './sql/updateUser.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  logout: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    await poolQuery(logout, [userId])

    return true
  },

  unregister: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const user = await poolQuery(getUserKakaoId, [userId])

    await fetch('https://kapi.kakao.com/v1/user/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
      },
      body: `target_id_type=user_id&target_id=${user.rows[0].kakao_oauth}`,
    })

    const { rows } = await poolQuery(unregister, [userId])

    return graphqlRelationMapping(rows[0], 'user')
  },

  updateUser: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const { rows } = await poolQuery(updateUser, [
      input.nickname,
      input.imageUrl,
      input.email,
      input.phoneNumber,
      input.gender,
      input.ageRange,
      input.birthday,
      input.bio,
      userId,
    ])

    return graphqlRelationMapping(rows[0], 'user')
  },
}
