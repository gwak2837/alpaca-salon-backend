SELECT id,
  nickname,
  phone_number,
  unique_name
FROM "user"
WHERE kakao_oauth = $1