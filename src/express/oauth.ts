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
    case 'famale':
      return 2
    default:
      return 0
  }
}

function verifyTargetCustomer(user: any) {
  return true
}

function hasRequiredInfo(user: any) {
  return user.nickname && user.phone
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
    const frontendUrl = req.headers.referer ?? ''

    if (!req.query.code) {
      return res.status(400).send('400 Bad Request')
    }

    const kakaoUserToken = await fetchKakaoUserToken(req.query.code as string)
    console.log('👀 - kakaoUserToken', kakaoUserToken)
    const kakaoUserInfo = await fetchKakaoUserInfo(kakaoUserToken.access_token as string)
    console.log('👀 - kakaoUserInfo', kakaoUserInfo)

    const findKakaoUserResult = await poolQuery(findKakaoUser, [kakaoUserInfo.id])
    const kakaoUser = findKakaoUserResult.rows[0]

    // 이미 kakao 소셜 로그인 정보가 존재하는 경우
    if (kakaoUser?.id) {
      // 4050 여성이 아닌 경우
      if (!verifyTargetCustomer(kakaoUser)) {
        return res.redirect(`${frontendUrl}/sorry`)
      }

      const jwt = await generateJWT({ userId: kakaoUser.id })

      // nickname 또는 phone 정보가 없는 경우
      if (!hasRequiredInfo(kakaoUser)) {
        return res.redirect(
          `${frontendUrl}/oauth/register?${encodeURIComponent(
            JSON.stringify({ jwt, user: kakaoUser }, null, 2)
          )}`
        )
      }

      return res.redirect(`${frontendUrl}/oauth?${encodeURIComponent(jwt)}`)
    }

    // kakao 소셜 로그인 정보가 없는 경우
    const kakaoAccount = kakaoUserInfo.kakao_account as any
    const { rows } = await poolQuery(registerKakaoUser, [
      kakaoAccount.profile.nickname,
      kakaoAccount.profile.profile_image_url,
      kakaoAccount.email,
      kakaoAccount.phone,
      null,
      encodeGender(kakaoAccount.gender),
      kakaoAccount.age_range,
      kakaoAccount.birthday,
      null,
      kakaoUserInfo.id,
    ])
    const newKakaoUser = rows[0]

    // 4050 여성이 아닌 경우
    if (!verifyTargetCustomer(newKakaoUser)) {
      return res.redirect(`${frontendUrl}/sorry`)
    }

    const jwt = await generateJWT({ userId: newKakaoUser.id })

    // nickname 또는 phone 정보가 없는 경우
    if (!hasRequiredInfo(newKakaoUser)) {
      return res.redirect(
        `${frontendUrl}/oauth/register?${encodeURIComponent(
          JSON.stringify({ jwt, user: newKakaoUser }, null, 2)
        )}`
      )
    }

    return res.redirect(`${frontendUrl}/oauth?${encodeURIComponent(jwt)}`)
  })
}
