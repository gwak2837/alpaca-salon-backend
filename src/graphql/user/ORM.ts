import { Provider } from '../generated/graphql'

export function decodeProviders(user: Partial<any>) {
  const providers = []

  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.AlpacaSalon)

  return providers
}
