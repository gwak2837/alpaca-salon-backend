INSERT INTO "comment" (contents, post_id, user_id, comment_id)
VALUES ($1, $2, $3, $4)
RETURNING id