INSERT INTO "user" (
    nickname,
    image_url,
    email,
    phone_number,
    gender,
    birthyear,
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
    'kakao'
  )
RETURNING id,
  phone_number