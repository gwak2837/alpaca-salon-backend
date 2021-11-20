SELECT id,
  nickname,
  image_url,
  COUNT(liked_user_id) AS liked_count
FROM "user"
  LEFT JOIN user_x_liked_comment ON liked_user_id = id
WHERE unique_name = $1
GROUP BY id