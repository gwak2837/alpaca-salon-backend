SELECT post.id,
  post.creation_time,
  title,
  post.contents,
  post.image_urls,
  COUNT("comment".id) AS comment_count,
  "user".id AS user__id,
  "user".nickname AS user__nickname,
  "user".image_url AS user__image_url
FROM post
  JOIN "user" ON "user".id = post.user_id
  LEFT JOIN "comment" ON "comment".post_id = post.id
WHERE post.id = $1
GROUP BY post.id,
  "user".id