SELECT id,
  nickname,
  phone
FROM "user"
WHERE kakao_oauth = $1