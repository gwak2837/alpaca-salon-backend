SELECT post.id,
  post.creation_time,
  title,
  contents,
  post.image_urls,
  "user".id AS user__id,
  "user".nickname AS user__nickname,
  "user".image_url AS user__image_url
FROM post
  JOIN "user" ON "user".id = post.user_id
WHERE post.id = $1