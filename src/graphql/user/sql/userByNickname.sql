SELECT "user".id,
  nickname,
  image_url,
  COUNT(user_x_liked_comment.comment_id) AS liked_count
FROM "user"
  LEFT JOIN "comment" ON "comment".user_id = "user".id
  LEFT JOIN user_x_liked_comment ON user_x_liked_comment.comment_id = "comment".id
WHERE nickname = $1
GROUP BY "user".id