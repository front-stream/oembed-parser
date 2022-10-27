// utils -> fetchEmbed

import retrieve from './retrieve.js'
import { getDomain } from './linker.js'

const env = process.env || {};

const store = {
  facebook_app_id: env.FACEBOOK_APP_ID || '',
  facebook_client_token: env.FACEBOOK_CLIENT_TOKEN || ''
}

export const setFacebookCredentials = (app_id, client_token) => {
  store.facebook_app_id = app_id;
  store.facebook_client_token = client_token;
}

const isFacebookGraphDependent = (url) => {
  return getDomain(url) === 'graph.facebook.com'
}

const getFacebookGraphToken = () => {
  const appId = store.facebook_app_id;
  const clientToken = store.facebook_client_token;
  return `${appId}|${clientToken}`
}

export default async (url, params = {}, endpoint = '', options = {}) => {
  const query = {
    url,
    format: 'json',
    ...params
  }

  if (query.maxwidth <= 0) {
    delete query.maxwidth
  }
  if (query.maxheight <= 0) {
    delete query.maxheight
  }

  if (isFacebookGraphDependent(endpoint)) {
    query.access_token = getFacebookGraphToken()
  }

  const queryParams = new URLSearchParams(query).toString()
  const link = endpoint + '?' + queryParams
  const body = retrieve(link, options)
  return body
}
