// main

const {
  isValidURL,
  findProvider,
  fetchEmbed,
  providersFromList,
} = require('./utils');

const defaultProviderList = require('./utils/providers.json');
let providers = providersFromList(defaultProviderList);
let facebookAccessToken = '365101066946402|a56861eb5b787f9e9a18e4e09ea5c873';

const extract = async (url, params = {}) => {
  if (!isValidURL(url)) {
    throw new Error('Invalid input URL');
  }
  const p = findProvider(url, providers);
  if (!p) {
    throw new Error(`No provider found with given url "${url}"`);
  }

  const data = await fetchEmbed(url, p, params, facebookAccessToken);
  return data;
};

const hasProvider = (url) => {
  return findProvider(url, providers) !== null;
};

const setProviderList = (list) => {
  providers = providersFromList(list);
};

const setFacebookAccessToken = (token) => {
  facebookAccessToken = token;
}

module.exports = {
  extract,
  hasProvider,
  setProviderList,
  setFacebookAccessToken
};
