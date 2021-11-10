import { snakeToCamel } from '../../utils'

type ObjectRelationMapping = (a: any) => Record<string, unknown>

// Database column -> GraphQL field
const orm: Record<string, ObjectRelationMapping> = {
  default: (row: Record<string, unknown>) => {
    const graphql: Record<string, unknown> = {}
    for (const column in row) {
      graphql[snakeToCamel(column)] = row[column]
    }
    return graphql
  },
}

// Database row -> GraphQL object
export function graphqlRelationMapping(row: Record<string, unknown>, tableName: string) {
  let selfTable: Record<string, unknown> = {}
  const otherTables: Record<string, Record<string, unknown>> = {}

  for (const column in row) {
    const value = row[column]
    if (column.includes('__')) {
      const [snakeTable, snakeColumn] = column.split('__')
      if (!otherTables[snakeTable]) otherTables[snakeTable] = {}
      otherTables[snakeTable][snakeColumn] = value
    } else {
      selfTable[column] = value
    }
  }

  selfTable = (orm[tableName] ?? orm.default)(selfTable)

  for (const otherTable in otherTables) {
    otherTables[otherTable] = (orm[otherTable] ?? orm.default)(otherTables[otherTable])
  }

  return { ...selfTable, ...otherTables } as any
}
