// retrieve.test
/* eslint-env jest */

import nock from 'nock'

import retrieve from './retrieve.js'

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

describe('test retrieve() method', () => {
  test('test retrieve from good source', async () => {
    const url = 'https://some.where/good/source'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, { data: { name: 'oembed-parser' } }, {
      'Content-Type': 'application/json'
    })
    const result = await retrieve(url)
    expect(result.data.name).toEqual('oembed-parser')
  })

  test('test retrieve with error 500', () => {
    const url = 'https://some.where/error/500'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(500, 'Error 500')
    expect(retrieve(url)).rejects.toThrow(new Error('AxiosError: Request failed with status code 500'))
  })

  test('test retrieve with unsupported content type', () => {
    const url = 'https://some.where/unsupported-content-type'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, { data: { name: 'oembed-parser' } }, {
      'Content-Type': 'abc/js'
    })
    expect(retrieve(url)).rejects.toThrow(new Error('Error: Invalid content type: "abc/js"'))
  })
})
