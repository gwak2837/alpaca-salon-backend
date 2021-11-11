SELECT post.id,
  category,
  title,
  post.contents,
  "user".id,
  "user".nickname,
  COUNT("comment".id)
FROM post
  JOIN "comment" ON "comment".post_id = post.id
  JOIN "user" ON "user".id = post.user_id
WHERE id < $1
GROUP BY post.id,
  "user".id
FETCH FIRST $2 ROWS ONLY