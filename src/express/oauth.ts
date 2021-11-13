import querystring from 'querystring'

import { Express } from 'express'
import fetch from 'node-fetch'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import { poolQuery } from '../database/postgres'
import { generateJWT } from '../utils/jwt'
import socialLogin from './sql/socialLogin.sql'

async function kakaoOauth(code: string) {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&client_id=e0732991ea45d45177b0d7f431d2f8d9&code=${code}`,
  })

  return (await response.json()) as Record<string, unknown>
}

async function getKakaoUserInfo(accessToken: string) {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return (await response.json()) as Record<string, unknown>
}

export function setPassportStrategies(app: Express) {
  // Kakao oauth
  app.get('/oauth/kakao', async (req, res) => {
    const frontendUrl = req.headers.referer ?? ''

    if (req.query.code) {
      const result = await kakaoOauth(req.query.code as string)
      const kakaoUserInfo = await getKakaoUserInfo(result.access_token as string)
      console.log('👀 - kakaoUserInfo', kakaoUserInfo)
      return res.redirect(
        `${frontendUrl}/oauth?${encodeURIComponent(JSON.stringify(kakaoUserInfo, null, 2))}`
      )
    }

    return res.redirect(frontendUrl)
  })

  app.use(passport.initialize())

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: `${process.env.BACKEND_URL}/oauth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        if (profile.emails && (profile.emails[0] as any).verified) {
          const { rows } = await poolQuery(socialLogin, [
            profile.emails[0].value,
            profile.displayName,
            null,
            null,
            null,
            profile.photos?.map((photo) => photo.value),
            null,
            null,
            profile.emails[0].value,
            null,
            null,
          ])

          done(null, { id: rows[0].user_id })
        } else {
          // email not verified or no email

          done(null)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    console.log('user', user)
    done(null, user)
  })

  passport.deserializeUser((obj, done) => {
    console.log('obj', obj)
    done(null, obj as any)
  })

  app.get(
    '/oauth/google',
    passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
  )

  app.get(
    '/oauth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/aa',
    }),
    async (req, res) => {
      if (req.user) {
        const query = querystring.stringify({
          token: await generateJWT({ userId: (req.user as any).id }),
        })
        res.redirect(`${process.env.FRONTEND_URL}/auth?${query}`)
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/signin`)
      }
    }
  )
}
