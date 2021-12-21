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
  END,
  image_urls = CASE
    WHEN $4 IS NULL THEN image_urls
    ELSE $4
  END
WHERE id = $5
  AND user_id = $6
  AND (
    category <> $1
    OR title <> $2
    OR contents <> $3
    OR image_urls <> $4
  )
RETURNING id,
  category,
  title,
  contents,
  image_urls