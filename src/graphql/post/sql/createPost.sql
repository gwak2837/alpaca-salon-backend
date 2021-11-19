INSERT INTO post (category, title, contents, user_id)
VALUES ($1, $2, $3, $4)
RETURNING id