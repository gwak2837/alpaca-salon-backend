SELECT id,
  creation_time,
  contents,
  user_id
FROM post
WHERE id = $1