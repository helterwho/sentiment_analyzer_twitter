import axios from 'axios'

export const webservice = () => {
  let headers = {
    'Content-Type': 'application/json',
  }

  let instance = axios.create({
    baseURL: 'https://api-text-mining.herokuapp.com/',
    headers,
  })

  return instance
}
