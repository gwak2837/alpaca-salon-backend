UPDATE post
SET modification_time = CURRENT_TIMESTAMP,
  category = CASE
    WHEN $1 IS NULL THEN category
    ELSE $1
  END,
  title = CASE
    WHEN $2 IS NULL THEN title
    ELSE $2
  END,
  contents = CASE
    WHEN $3 IS NULL THEN contents
    ELSE $3
  END
WHERE id = $4
  AND user_id = $5
  AND (
    category <> $1
    OR title <> $2
    OR contents <> $3
  )
RETURNING *