/**
 * AUTO-GENERATED FILE @ Thu, 11 Nov 2021 09:06:51 GMT - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.0.0.12
 * $ schemats generate postgres://username:password@localhost:5432/alpaca_salon -s public
 *
 */

export interface post {
  id: number
  creation_time: Date
  modification_time: Date
  category: number
  title: string
  contents: string
  user_id: string
}

export interface user_x_reserved_event {
  user_id: string
  event_id: number
  creation_time: Date
}

export interface event {
  id: number
  creation_time: Date
  modification_time: Date
  title: string
  category: number
  location: string
  image_url: string
  event_url: string
  contents: string
  is_available: boolean
  date?: string | null
  price?: number | null
  user_id: string
}

export interface user_x_liked_event {
  user_id: string
  event_id: number
  creation_time: Date
}

export interface hashtag {
  id: number
  creation_time: Date
  name: string
}

export interface user_x_liked_comment {
  liking_user_id: string
  liked_user_id: string
  comment_id: number
  creation_time: Date
}

export interface comment {
  id: number
  creation_time: Date
  modification_time: Date
  contents: string
  post_id: number
  user_id: string
  comment_id?: number | null
}

export interface user {
  id: string
  creation_time: Date
  modification_time: Date
  unique_name: string
  nickname: string
  name?: string | null
  email?: string | null
  phone?: string | null
  birth?: Date | null
  bio?: string | null
  image_url?: string | null
  google_oauth?: string | null
  naver_oauth?: string | null
  kakao_oauth?: string | null
  password_hash: string
  validation_time: Date
}

export interface post_x_hashtag {
  post_id: number
  hashtag_id: number
  creation_time: Date
}

export interface Tables {
  post: post
  user_x_reserved_event: user_x_reserved_event
  event: event
  user_x_liked_event: user_x_liked_event
  hashtag: hashtag
  user_x_liked_comment: user_x_liked_comment
  comment: comment
  user: user
  post_x_hashtag: post_x_hashtag
}
