import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../database/postgres'
import { generateJWT } from '../utils/jwt'
import findKakaoUser from './sql/findKakaoUser.sql'
import registerKakaoUser from './sql/registerKakaoUser.sql'

function encodeGender(gender: string) {
  switch (gender) {
    case 'male':
      return 1
    case 'female':
      return 2
    default:
      return 0
  }
}

function verifyTargetCustomer(user: any) {
  // return user.gender === 'female' && +user.birthyear < 1980
  return true
}

function hasRequiredInfo(user: any) {
  return user.nickname && user.phone_number
}

async function fetchKakaoUserToken(code: string) {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&code=${code}`,
  })

  return (await response.json()) as Record<string, unknown>
}

async function fetchKakaoUserInfo(accessToken: string) {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return (await response.json()) as Record<string, unknown>
}

export function setOAuthStrategies(app: Express) {
  // Kakao OAuth
  app.get('/oauth/kakao', async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send('400 Bad Request')
    }

    const kakaoUserToken = await fetchKakaoUserToken(req.query.code as string)
    if (kakaoUserToken.error) {
      return res.status(400).send('400 Bad Request')
    }

    const kakaoUserInfo = await fetchKakaoUserInfo(kakaoUserToken.access_token as string)

    const findKakaoUserResult = await poolQuery(findKakaoUser, [kakaoUserInfo.id])
    const kakaoUser = findKakaoUserResult.rows[0]

    const frontendUrl = process.env.FRONTEND_URL

    // 이미 kakao 소셜 로그인 정보가 존재하는 경우
    if (kakaoUser?.id) {
      // 4050 여성이 아닌 경우
      if (!verifyTargetCustomer(kakaoUser)) {
        return res.redirect(`${frontendUrl}/sorry`)
      }

      const jwt = await generateJWT({ userId: kakaoUser.id })

      // 필수 정보가 없는 경우
      if (!hasRequiredInfo(kakaoUser)) {
        return res.redirect(
          `${frontendUrl}/oauth/register?${new URLSearchParams({
            jwt,
            nickname: kakaoUser.nickname,
            phoneNumber: kakaoUser.phone_number,
          })}`
        )
      }

      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({ jwt, nickname: kakaoUser.nickname })}`
      )
    }

    // kakao 소셜 로그인 정보가 없는 경우
    const kakaoAccount = kakaoUserInfo.kakao_account as any
    const { rows } = await poolQuery(registerKakaoUser, [
      null,
      null,
      kakaoAccount.email,
      kakaoAccount.phone_number,
      encodeGender(kakaoAccount.gender),
      kakaoAccount.birthyear,
      kakaoAccount.birthday,
      '알파카의 소개가 아직 없어요.',
      kakaoUserInfo.id,
    ])
    const newKakaoUser = rows[0]

    // 4050 여성이 아닌 경우
    if (!verifyTargetCustomer(newKakaoUser)) {
      return res.redirect(`${frontendUrl}/sorry`)
    }

    const queryString = new URLSearchParams({
      jwt: await generateJWT({ userId: newKakaoUser.id }),
      phoneNumber: newKakaoUser.phone_number,
    })

    return res.redirect(`${frontendUrl}/oauth/register?${queryString}`)
  })
}
