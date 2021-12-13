-- public 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public AUTHORIZATION alpaca_salon;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO alpaca_salon;

-- deleted 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION alpaca_salon;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO alpaca_salon;

-- validation_time 이전 JWT 토큰은 유효하지 않음
-- gender
-- 0: 미확인, 1: 남성, 2: 여성
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50) UNIQUE,
  phone_number varchar(20) UNIQUE,
  nickname varchar(50) UNIQUE,
  image_url text,
  gender int,
  birthyear varchar(4),
  birthday varchar(4),
  bio varchar(100),
  --
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE,
  password_hash text NOT NULL,
  validation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- category
-- 0: 갱년기, 1: 수다
CREATE TABLE post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  category int NOT NULL,
  title varchar(100) NOT NULL,
  contents text NOT NULL,
  image_urls text [],
  user_id uuid NOT NULL REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE question (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title text NOT NULL,
  contents text NOT NULL
);

CREATE TABLE answer (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  image_urls text [],
  --
  question_id bigint NOT NULL REFERENCES question ON DELETE CASCADE
);

CREATE TABLE answer_comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  --
  answer_id bigint NOT NULL REFERENCES answer ON DELETE
  SET NULL,
    user_id uuid NOT NULL REFERENCES "user" ON DELETE
  SET NULL,
    comment_id bigint REFERENCES answer_comment ON DELETE
  SET NULL
);

-- user_id: 줌 진행자
-- category
-- 0: 전문가 강의, 1: 수다
CREATE TABLE event (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  category int NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  event_url text NOT NULL,
  contents text NOT NULL,
  is_available boolean NOT NULL DEFAULT FALSE,
  date text,
  price int,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  contents text,
  image_urls text [],
  --
  comment_id bigint REFERENCES "comment" ON DELETE
  SET NULL,
    post_id bigint REFERENCES post ON DELETE
  SET NULL,
    user_id uuid REFERENCES "user" ON DELETE
  SET NULL
);

CREATE TABLE hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE user_x_liked_event (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  event_id bigint REFERENCES event ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE user_x_reserved_event (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  event_id bigint REFERENCES event ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE user_x_liked_comment (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE post_x_hashtag (
  post_id bigint REFERENCES post ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE TABLE deleted.user (
  id uuid PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50),
  phone_number varchar(20),
  gender int,
  birthyear varchar(4),
  birthday varchar(4),
  --
  google_oauth text,
  naver_oauth text,
  kakao_oauth text
);

CREATE TABLE deleted.post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  user_id uuid NOT NULL REFERENCES deleted.user ON DELETE CASCADE
);

CREATE TABLE deleted.comment (
  id bigint PRIMARY KEY,
  creation_time timestamptz NOT NULL,
  modification_time timestamptz NOT NULL,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  image_urls text [],
  --
  comment_id bigint,
  post_id bigint,
  user_id uuid
);

CREATE TABLE deleted.hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE deleted.event (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  category int NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  event_url text NOT NULL,
  contents text NOT NULL,
  is_available boolean NOT NULL DEFAULT FALSE,
  date text,
  price int,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE FUNCTION delete_user () RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO deleted.user(
    id,
    creation_time,
    modification_time,
    email,
    phone_number,
    gender,
    birthyear,
    birthday,
    google_oauth,
    naver_oauth,
    kakao_oauth
  )
VALUES((OLD).*);

RETURN OLD;

END $$;

CREATE TRIGGER delete_user BEFORE DELETE ON "user" FOR EACH ROW EXECUTE FUNCTION delete_user();

CREATE FUNCTION delete_comment (
  comment_id bigint,
  user_id uuid,
  out deleted_comment_id bigint
) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO deleted.comment (
    id,
    creation_time,
    modification_time,
    contents,
    image_urls,
    comment_id,
    post_id,
    user_id
  )
SELECT *
FROM "comment"
WHERE id = delete_comment.comment_id
  AND "comment".user_id = delete_comment.user_id;

UPDATE "comment"
SET modification_time = CURRENT_TIMESTAMP,
  contents = NULL,
  image_urls = NULL
WHERE id = delete_comment.comment_id
  AND "comment".user_id = delete_comment.user_id
RETURNING id INTO deleted_comment_id;

DELETE FROM user_x_liked_comment
WHERE user_x_liked_comment.comment_id = delete_comment.comment_id;

END $$;

CREATE FUNCTION toggle_liking_comment (
  user_id uuid,
  comment_id bigint,
  out result boolean,
  out liked_count int
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_comment
WHERE user_x_liked_comment.user_id = toggle_liking_comment.user_id
  AND user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

IF FOUND THEN
DELETE FROM user_x_liked_comment
WHERE user_x_liked_comment.user_id = toggle_liking_comment.user_id
  AND user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

SELECT COUNT(user_x_liked_comment.user_id) INTO liked_count
FROM user_x_liked_comment
WHERE user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

result = FALSE;

RETURN;

ELSE
INSERT INTO user_x_liked_comment (user_id, comment_id)
VALUES (
    toggle_liking_comment.user_id,
    toggle_liking_comment.comment_id
  );

SELECT COUNT(user_x_liked_comment.user_id) INTO liked_count
FROM user_x_liked_comment
WHERE user_x_liked_comment.comment_id = toggle_liking_comment.comment_id;

result = TRUE;

RETURN;

END IF;

END $$;

CREATE FUNCTION search_post (keywords text []) RETURNS TABLE (id bigint) LANGUAGE plpgsql STABLE AS $$ BEGIN RETURN QUERY
SELECT post.id
FROM post
WHERE title LIKE ANY (keywords)
  OR contents LIKE ANY (keywords);

END $$;