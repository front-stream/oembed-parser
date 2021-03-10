// utils -> fetchEmbed

const fetch = require('node-fetch').default;

const isInstagram = (provider) => {
  return provider.provider_name === 'Instagram';
};

const isFacebook = (provider) => {
  return provider.provider_name === 'Facebook';
};

const getRegularUrl = (query, basseUrl) => {
  return basseUrl.replace(/\{format\}/g, 'json') + '?' + query;
};

const fetchEmbed = async (url, provider, params = {}, facebookAccessToken) => {
  const {
    provider_name, // eslint-disable-line camelcase
    provider_url, // eslint-disable-line camelcase
  } = provider;

  const queries = [
    'format=json',
    `url=${encodeURIComponent(url)}`,
  ];

  const {
    maxwidth = 0,
    maxheight = 0,
  } = params;

  if (maxwidth > 0) {
    queries.push(`maxwidth=${maxwidth}`);
  }
  if (maxheight > 0) {
    queries.push(`maxheight=${maxheight}`);
  }
  const query = queries.join('&');

  let link = getRegularUrl(query, provider.url);

  if(isInstagram(provider) || isFacebook(provider)){
    link += '&access_token='+facebookAccessToken;
  }

  const res = await fetch(link);
  const json = await res.json();
  json.provider_name = provider_name; // eslint-disable-line camelcase
  json.provider_url = provider_url; // eslint-disable-line camelcase
  return json;
};

module.exports = fetchEmbed;
