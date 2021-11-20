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
  unique_name varchar(50) UNIQUE,
  nickname varchar(50),
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
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
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
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text NOT NULL,
  --
  post_id bigint NOT NULL REFERENCES post ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE
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
  liking_user_id uuid REFERENCES "user" ON DELETE CASCADE,
  liked_user_id uuid REFERENCES "user" ON DELETE CASCADE,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (liking_user_id, liked_user_id, comment_id)
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
  nickname varchar(50) NOT NULL,
  image_url text,
  email varchar(50) UNIQUE,
  phone_number varchar(20) UNIQUE,
  unique_name varchar(50) UNIQUE,
  gender int,
  age_range varchar(5),
  birthday varchar(4),
  bio varchar(100),
  --
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE
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
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text [] NOT NULL,
  image_url text,
  --
  comment_id bigint REFERENCES deleted.comment ON DELETE CASCADE,
  post_id bigint NOT NULL REFERENCES deleted.post ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES deleted.user ON DELETE CASCADE
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

CREATE FUNCTION delete_user (user_id uuid, out deleted_user_id uuid) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO deleted.user
SELECT *
FROM "user"
WHERE id = user_id;

DELETE FROM "user"
WHERE id = user_id;

END $$;

-- result
-- 0: 사용자 등록 성공
-- 1: `unique_name`이 이미 존재
-- CREATE FUNCTION create_user (
--   unique_name varchar(50),
--   nickname varchar(50),
--   password_hash text,
--   name varchar(50) DEFAULT NULL,
--   email varchar(50) DEFAULT NULL,
--   phone varchar(20) DEFAULT NULL,
--   birth date DEFAULT NULL,
--   bio varchar(50) DEFAULT NULL,
--   image_url text DEFAULT NULL,
--   google_oauth text DEFAULT NULL,
--   naver_oauth text DEFAULT NULL,
--   kakao_oauth text DEFAULT NULL,
--   out result int,
--   out user_id uuid,
--   out user_unique_name varchar(50)
-- ) LANGUAGE plpgsql AS $$ BEGIN PERFORM
-- FROM "user"
-- WHERE "user".unique_name = create_user.unique_name
--   OR "user".email = create_user.email;
-- IF found THEN result = 1;
-- RETURN;
-- END IF;
-- INSERT INTO "user" (
--     unique_name,
--     nickname,
--     password_hash,
--     name,
--     email,
--     phone,
--     birth,
--     bio,
--     image_url,
--     google_oauth,
--     naver_oauth,
--     kakao_oauth
--   )
-- VALUES (
--     unique_name,
--     nickname,
--     password_hash,
--     name,
--     email,
--     phone,
--     birth,
--     bio,
--     image_url,
--     google_oauth,
--     naver_oauth,
--     kakao_oauth
--   )
-- RETURNING "user".id,
--   "user".unique_name INTO user_id,
--   user_unique_name;
-- result = 0;
-- RETURN;
-- END $$;
-- CREATE FUNCTION create_post (
--   title varchar(100),
--   contents text,
--   user_id uuid,
--   out post_id bigint
-- ) LANGUAGE plpgsql AS $$ BEGIN
-- INSERT INTO post (title, contents, user_id)
-- VALUES (title, contents, user_id)
-- RETURNING post.id INTO post_id;
-- END $$;
CREATE FUNCTION create_event (
  title varchar(100),
  category int,
  location text,
  image_url text,
  event_url text,
  contents text,
  user_id uuid,
  is_available boolean DEFAULT false,
  date text DEFAULT NULL,
  price int DEFAULT NULL,
  out post_id bigint
) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO post (
    title,
    category,
    location,
    image_url,
    event_url,
    contents,
    user_id,
    is_available,
    date,
    price
  )
VALUES (
    title,
    category,
    location,
    image_url,
    event_url,
    contents,
    user_id,
    is_available,
    date,
    price
  )
RETURNING post.id INTO post_id;

END $$;

CREATE FUNCTION create_comment (
  contents text,
  post_id bigint,
  user_id uuid,
  parent_comment_id bigint DEFAULT NULL,
  out comment_id bigint
) LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO "comment" (contents, comment_id, post_id, user_id)
VALUES (contents, parent_comment_id, post_id, user_id)
RETURNING "comment".id INTO comment_id;

END $$;

CREATE FUNCTION search_post (keywords text []) RETURNS TABLE (id bigint) LANGUAGE plpgsql STABLE AS $$ BEGIN RETURN QUERY
SELECT post.id
FROM post
WHERE title LIKE ANY (keywords)
  OR contents LIKE ANY (keywords);

END $$;