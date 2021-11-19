UPDATE "user"
SET modification_time = CURRENT_TIMESTAMP,
  nickname = CASE
    WHEN $1 IS NULL THEN nickname
    ELSE $1
  END,
  image_url = CASE
    WHEN $2 IS NULL THEN image_url
    ELSE $2
  END,
  email = CASE
    WHEN $3 IS NULL THEN email
    ELSE $3
  END,
  phone_number = CASE
    WHEN $4 IS NULL THEN phone_number
    ELSE $4
  END,
  unique_name = CASE
    WHEN $5 IS NULL THEN unique_name
    ELSE $5
  END,
  gender = CASE
    WHEN $6 IS NULL THEN gender
    ELSE $6
  END,
  age_range = CASE
    WHEN $7 IS NULL THEN age_range
    ELSE $7
  END,
  birthday = CASE
    WHEN $8 IS NULL THEN birthday
    ELSE $8
  END,
  bio = CASE
    WHEN $9 IS NULL THEN bio
    ELSE $9
  END
WHERE id = $10
  AND (
    nickname <> $1
    OR image_url <> $2
    OR email <> $3
    OR phone_number <> $4
    OR unique_name <> $5
    OR gender <> $6
    OR age_range <> $7
    OR birthday <> $8
    OR bio <> $9
  )
RETURNING *