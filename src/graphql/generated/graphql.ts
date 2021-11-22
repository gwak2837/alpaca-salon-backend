/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  DateTime: any
  EmailAddress: any
  JWT: any
  LastValue: any
  Latitude: any
  Longitude: any
  NonEmptyString: any
  PositiveInt: any
  URL: any
  UUID: any
}

export type Comment = {
  __typename?: 'Comment'
  contents: Array<Scalars['NonEmptyString']>
  creationTime: Scalars['DateTime']
  id: Scalars['ID']
  imageUrl?: Maybe<Scalars['URL']>
  modificationTime: Scalars['DateTime']
  /** 이 댓글의 상위 댓글 */
  parentComment?: Maybe<Comment>
  /** 이 댓글이 달린 피드 */
  post: Post
  /** 댓글을 작성한 사용자 */
  user: User
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
}

export type Mutation = {
  __typename?: 'Mutation'
  createPost?: Maybe<Post>
  deletePost?: Maybe<Post>
  /** JWT 인증 토큰과 같이 요청하면 로그아웃 성공 여부를 반환함 */
  logout: Scalars['Boolean']
  /** 회원탈퇴 시 사용자 정보가 모두 초기화됩 */
  unregister?: Maybe<User>
  updatePost?: Maybe<Post>
  updateUser?: Maybe<User>
}

export type MutationCreatePostArgs = {
  input: PostCreationInput
}

export type MutationDeletePostArgs = {
  id: Scalars['ID']
}

export type MutationUpdatePostArgs = {
  input: PostModificationInput
}

export type MutationUpdateUserArgs = {
  input: UserModificationInput
}

/** 기본값: 내림차순 */
export enum OrderDirection {
  Asc = 'ASC',
}

export type Pagination = {
  lastId?: Maybe<Scalars['ID']>
  lastValue?: Maybe<Scalars['LastValue']>
  limit: Scalars['PositiveInt']
}

export type Post = {
  __typename?: 'Post'
  category: PostCategory
  commentCount: Scalars['PositiveInt']
  contents: Scalars['NonEmptyString']
  creationTime: Scalars['DateTime']
  /** 피드에 달린 해시태그 */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  id: Scalars['ID']
  /** 피드 좋아요 여부 (로그인 필요) */
  isLiked: Scalars['Boolean']
  modificationTime: Scalars['DateTime']
  title: Scalars['NonEmptyString']
  /** 글쓴이 */
  user: User
}

export enum PostCategory {
  FreeTopic = 'FREE_TOPIC',
  Menopause = 'MENOPAUSE',
  Undefined = 'UNDEFINED',
}

export type PostCreationInput = {
  category?: Maybe<PostCategory>
  contents?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type PostModificationInput = {
  category?: Maybe<PostCategory>
  contents?: Maybe<Scalars['String']>
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
}

/** OAuth 공급자 */
export enum Provider {
  AlpacaSalon = 'ALPACA_SALON',
  Kakao = 'KAKAO',
}

export type Query = {
  __typename?: 'Query'
  /** 특정 게시글에 달린 댓글 */
  commentsByPost?: Maybe<Array<Maybe<Comment>>>
  /** 사용자 닉네임 중복 여부 검사 */
  isNicknameUnique: Scalars['Boolean']
  /** 좋아요 누른 댓글 */
  likedComments?: Maybe<Array<Comment>>
  /** 현재 로그인된(JWT) 사용자 정보를 반환 */
  me?: Maybe<User>
  /** 내가 쓴 댓글 */
  myComments?: Maybe<Array<Comment>>
  /** 글 상세 */
  post?: Maybe<Post>
  /** 글 목록 */
  posts?: Maybe<Array<Post>>
  /** 글 검색 */
  searchPosts?: Maybe<Array<Post>>
  /** 대댓글 */
  subComments?: Maybe<Array<Maybe<Comment>>>
  /** 닉네임으로 사용자 검색 */
  userByNickname?: Maybe<User>
}

export type QueryCommentsByPostArgs = {
  postId: Scalars['ID']
}

export type QueryIsNicknameUniqueArgs = {
  nickname: Scalars['NonEmptyString']
}

export type QueryPostArgs = {
  id: Scalars['ID']
}

export type QueryPostsArgs = {
  pagination: Pagination
}

export type QuerySearchPostsArgs = {
  keywords: Array<Scalars['NonEmptyString']>
}

export type QuerySubCommentsArgs = {
  id: Scalars['ID']
}

export type QueryUserByNicknameArgs = {
  nickname: Scalars['NonEmptyString']
}

export type User = {
  __typename?: 'User'
  bio?: Maybe<Scalars['NonEmptyString']>
  birthday?: Maybe<Scalars['NonEmptyString']>
  birthyear?: Maybe<Scalars['Int']>
  creationTime: Scalars['DateTime']
  email?: Maybe<Scalars['EmailAddress']>
  gender?: Maybe<Gender>
  id: Scalars['UUID']
  imageUrl?: Maybe<Scalars['URL']>
  likedCount: Scalars['Int']
  modificationTime: Scalars['DateTime']
  nickname?: Maybe<Scalars['NonEmptyString']>
  phoneNumber?: Maybe<Scalars['NonEmptyString']>
  providers: Array<Provider>
}

export type UserAuthentication = {
  __typename?: 'UserAuthentication'
  jwt: Scalars['JWT']
  nickname: Scalars['NonEmptyString']
}

export type UserModificationInput = {
  ageRange?: Maybe<Scalars['NonEmptyString']>
  bio?: Maybe<Scalars['String']>
  birthday?: Maybe<Scalars['NonEmptyString']>
  email?: Maybe<Scalars['EmailAddress']>
  gender?: Maybe<Gender>
  imageUrl?: Maybe<Scalars['URL']>
  nickname?: Maybe<Scalars['NonEmptyString']>
  phoneNumber?: Maybe<Scalars['NonEmptyString']>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Comment: ResolverTypeWrapper<Comment>
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  Gender: Gender
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  LastValue: ResolverTypeWrapper<Scalars['LastValue']>
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>
  Mutation: ResolverTypeWrapper<{}>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  OrderDirection: OrderDirection
  Pagination: Pagination
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>
  Post: ResolverTypeWrapper<Post>
  PostCategory: PostCategory
  PostCreationInput: PostCreationInput
  PostModificationInput: PostModificationInput
  Provider: Provider
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  URL: ResolverTypeWrapper<Scalars['URL']>
  UUID: ResolverTypeWrapper<Scalars['UUID']>
  User: ResolverTypeWrapper<User>
  UserAuthentication: ResolverTypeWrapper<UserAuthentication>
  UserModificationInput: UserModificationInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']
  Comment: Comment
  Date: Scalars['Date']
  DateTime: Scalars['DateTime']
  EmailAddress: Scalars['EmailAddress']
  ID: Scalars['ID']
  Int: Scalars['Int']
  JWT: Scalars['JWT']
  LastValue: Scalars['LastValue']
  Latitude: Scalars['Latitude']
  Longitude: Scalars['Longitude']
  Mutation: {}
  NonEmptyString: Scalars['NonEmptyString']
  Pagination: Pagination
  PositiveInt: Scalars['PositiveInt']
  Post: Post
  PostCreationInput: PostCreationInput
  PostModificationInput: PostModificationInput
  Query: {}
  String: Scalars['String']
  URL: Scalars['URL']
  UUID: Scalars['UUID']
  User: User
  UserAuthentication: UserAuthentication
  UserModificationInput: UserModificationInput
}

export type CommentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']
> = {
  contents?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  parentComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT'
}

export interface LastValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['LastValue'], any> {
  name: 'LastValue'
}

export interface LatitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude'
}

export interface LongitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude'
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createPost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, 'input'>
  >
  deletePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostArgs, 'id'>
  >
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  unregister?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updatePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, 'input'>
  >
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >
}

export interface NonEmptyStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString'
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type PostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']
> = {
  category?: Resolver<ResolversTypes['PostCategory'], ParentType, ContextType>
  commentCount?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>
  contents?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  commentsByPost?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Comment']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCommentsByPostArgs, 'postId'>
  >
  isNicknameUnique?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsNicknameUniqueArgs, 'nickname'>
  >
  likedComments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  myComments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'id'>
  >
  posts?: Resolver<
    Maybe<Array<ResolversTypes['Post']>>,
    ParentType,
    ContextType,
    RequireFields<QueryPostsArgs, 'pagination'>
  >
  searchPosts?: Resolver<
    Maybe<Array<ResolversTypes['Post']>>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchPostsArgs, 'keywords'>
  >
  subComments?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Comment']>>>,
    ParentType,
    ContextType,
    RequireFields<QuerySubCommentsArgs, 'id'>
  >
  userByNickname?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserByNicknameArgs, 'nickname'>
  >
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL'
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID'
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  bio?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  birthday?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  birthyear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['EmailAddress']>, ParentType, ContextType>
  gender?: Resolver<Maybe<ResolversTypes['Gender']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>
  likedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  nickname?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  phoneNumber?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  providers?: Resolver<Array<ResolversTypes['Provider']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserAuthenticationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserAuthentication'] = ResolversParentTypes['UserAuthentication']
> = {
  jwt?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>
  nickname?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  EmailAddress?: GraphQLScalarType
  JWT?: GraphQLScalarType
  LastValue?: GraphQLScalarType
  Latitude?: GraphQLScalarType
  Longitude?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  NonEmptyString?: GraphQLScalarType
  PositiveInt?: GraphQLScalarType
  Post?: PostResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  URL?: GraphQLScalarType
  UUID?: GraphQLScalarType
  User?: UserResolvers<ContextType>
  UserAuthentication?: UserAuthenticationResolvers<ContextType>
}
