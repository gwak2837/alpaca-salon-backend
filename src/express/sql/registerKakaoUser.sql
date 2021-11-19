INSERT INTO "user" (
    nickname,
    image_url,
    email,
    phone_number,
    unique_name,
    gender,
    age_range,
    birthday,
    bio,
    kakao_oauth,
    password_hash
  )
VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    'kakao'
  )
RETURNING id,
  phone_number