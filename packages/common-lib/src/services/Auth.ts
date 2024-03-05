import axios from 'axios'

export function fetchToken(
  authUrl: string,
  username: string,
  password: string
): Promise<any> {

  const payload = {
    username: username,
    password: password
  }

  return axios.post(authUrl, payload)
}
