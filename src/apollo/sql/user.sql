SELECT id
FROM "user"
WHERE id = $1
  AND validation_time < $2