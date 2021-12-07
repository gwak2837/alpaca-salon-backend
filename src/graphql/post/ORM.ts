import { Post } from '../generated/graphql'

function getFirstLine(c: string) {
  const i = c.indexOf('\n')
  return i !== -1 ? c.slice(0, i + 1) : c
}

export function postORM(row: Record<string, any>) {
  return {
    id: row.id,
    creationTime: row.creation_time,
    modificationTime: row.modification_time,
    category: row.category,
    title: row.title,
    contents: getFirstLine(row.contents),
    imageUrls: row.image_urls,
    commentCount: row.comment_count,
    user: {
      id: row.user__id,
      nickname: row.user__nickname,
    },
  } as unknown as Post
}
