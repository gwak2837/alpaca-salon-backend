import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import questions from './sql/questions.sql'

export const Query: QueryResolvers<ApolloContext> = {
  questions: async () => {
    const { rows } = await poolQuery(questions)
    return rows.map((row) => graphqlRelationMapping(row, 'question'))
  },
}
