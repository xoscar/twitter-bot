import fetch from 'node-fetch';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import {createInterface} from 'readline';
import {parse} from 'querystring';
import config from '../config.json';
import {TConfig} from '../src/types/common.types';
import {accessTokenURL, authorizeURL, requestTokenURL} from '../src/constants/twitter.constants';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const {
  api: {
    twitter: {
      credentials: {apiKey, apiSecret},
    },
  },
} = config as TConfig;

const oauth = new OAuth({
  consumer: {
    key: apiKey,
    secret: apiSecret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

const input = (prompt: string) =>
  new Promise(resolve => {
    readline.question(prompt, out => {
      readline.close();
      resolve(out);
    });
  });

const requestToken = async () => {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: 'POST',
    })
  );

  const response = await fetch(requestTokenURL, {
    method: 'POST',
    headers: {
      Authorization: authHeader['Authorization'],
    },
  });

  if (response.ok) {
    const text = await response.text();
    return text;
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
};

const accessToken = async (authTokenQuery: string, verifier: string) => {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: 'POST',
    })
  );

  const response = await fetch(`${accessTokenURL}?oauth_verifier=${verifier}&${authTokenQuery}`, {
    headers: {
      Authorization: authHeader['Authorization'],
    },
  });
  if (response.ok) {
    const text = await response.text();
    return text;
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
};

(async () => {
  try {
    const authTokenQuery: string = await requestToken();

    console.log('Please go here and authorize:', `${authorizeURL}?${authTokenQuery}`);
    const pin = (await input('Paste the PIN here: ')) as string;
    const oAuthAccessToken = await accessToken(authTokenQuery, pin.trim());

    console.log('Access Token', parse(oAuthAccessToken));
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();
