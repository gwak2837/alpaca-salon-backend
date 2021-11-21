UPDATE "user"
SET modification_time = CURRENT_TIMESTAMP,
  validation_time = CURRENT_TIMESTAMP
WHERE id = $1