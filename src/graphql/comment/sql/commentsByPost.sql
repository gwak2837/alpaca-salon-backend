SELECT "comment".id,
  "comment".creation_time,
  "comment".modification_time,
  "comment".contents,
  COUNT(DISTINCT user_x_liked_comment.user_id) AS liked_count,
  is_liked.user_id AS is_liked,
  "user".id AS user__id,
  "user".nickname AS user__nickname,
  "user".image_url AS user__image_url,
  subcomment.id AS subcomments__id,
  subcomment.creation_time AS subcomments__creation_time,
  subcomment.modification_time AS subcomments__modification_time,
  subcomment.contents AS subcomments__contents,
  COUNT(subcomment_liked_count.user_id) AS subcomments__liked_count,
  subcomment_is_liked.user_id AS subcomments__is_liked,
  subcomment_user.id AS subcomments__user__id,
  subcomment_user.nickname AS subcomments__user__nickname,
  subcomment_user.image_url AS subcomments__user__image_url
FROM "comment"
  LEFT JOIN "user" ON "user".id = "comment".user_id
  LEFT JOIN user_x_liked_comment ON user_x_liked_comment.comment_id = "comment".id
  LEFT JOIN user_x_liked_comment AS is_liked ON is_liked.comment_id = "comment".id
  AND is_liked.user_id = $2
  LEFT JOIN "comment" AS subcomment ON subcomment.comment_id = "comment".id
  LEFT JOIN "user" AS subcomment_user ON subcomment_user.id = subcomment.user_id
  LEFT JOIN user_x_liked_comment AS subcomment_liked_count ON subcomment_liked_count.comment_id = subcomment.id
  LEFT JOIN user_x_liked_comment AS subcomment_is_liked ON subcomment_is_liked.comment_id = subcomment.id
  AND subcomment_is_liked.user_id = $2
WHERE "comment".post_id = $1
  AND (
    "comment".comment_id IS NULL
    OR subcomment.id IS NOT NULL
  )
GROUP BY "comment".id,
  is_liked.user_id,
  "user".id,
  subcomment.id,
  subcomment_is_liked.user_id,
  subcomment_user.id
ORDER BY "comment".id,
  CASE
    WHEN subcomment.id IS NULL THEN "comment".id
    ELSE subcomment.id
  END