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
  gender = CASE
    WHEN $5 IS NULL THEN gender
    ELSE $5
  END,
  birthyear = CASE
    WHEN $6 IS NULL THEN birthyear
    ELSE $6
  END,
  birthday = CASE
    WHEN $7 IS NULL THEN birthday
    ELSE $7
  END,
  bio = CASE
    WHEN $8 IS NULL THEN bio
    ELSE $8
  END
WHERE id = $9
  AND (
    nickname IS DISTINCT
    FROM $1
      OR image_url IS DISTINCT
    FROM $2
      OR email IS DISTINCT
    FROM $3
      OR phone_number IS DISTINCT
    FROM $4
      OR gender IS DISTINCT
    FROM $5
      OR birthyear IS DISTINCT
    FROM $6
      OR birthday IS DISTINCT
    FROM $7
      OR bio IS DISTINCT
    FROM $8
  )
RETURNING id,
  nickname