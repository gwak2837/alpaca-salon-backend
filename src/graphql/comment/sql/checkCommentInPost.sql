SELECT id
FROM "comment"
WHERE post_id = $1
  AND id = $2