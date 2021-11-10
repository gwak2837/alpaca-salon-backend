import { Provider } from '../generated/graphql'

export function decodeProviders(user: Partial<any>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.AlpacaSalon)

  return providers
}
