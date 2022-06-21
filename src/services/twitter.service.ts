import fetch from 'node-fetch';
import OAuth from 'oauth-1.0a';
import {createHmac} from 'crypto';
import {TPost, TRawPost, TRawUser, TUser} from '../types/twitter.types';

const {
  TWITTER_API_URL = '',
  TWITTER_API_KEY = '',
  TWITTER_API_SECRET = '',
  TWITTER_OAUTH_TOKEN = '',
  TWITTER_OAUTH_TOKEN_SECRET = '',
} = process.env;

type TRequestParams = {
  url: string;
  headers?: Record<string, string>;
  body?: object;
  method?: string;
};

const oauth = new OAuth({
  consumer: {
    key: TWITTER_API_KEY,
    secret: TWITTER_API_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => createHmac('sha1', key).update(baseString).digest('base64'),
});

const getAuthHeader = (url: string, method = 'GET') => {
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url,
        method,
      },
      {
        key: TWITTER_OAUTH_TOKEN,
        secret: TWITTER_OAUTH_TOKEN_SECRET,
      }
    )
  );

  return {
    Authorization: authHeader['Authorization'],
    'user-agent': 'v2CreateTweetJS',
    'content-type': 'application/json',
    accept: 'application/json',
  };
};

const request = async <T>({url, headers = {}, body, method = 'GET'}: TRequestParams): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      ...getAuthHeader(url, method),
      ...headers,
    },
    body: JSON.stringify(body),
    method,
  });
  const json = await response.json();

  return json as T;
};

const TwitterService = () => ({
  async getUser(username: string): Promise<TUser> {
    const response = await request<TRawUser>({
      url: `${TWITTER_API_URL}/users/by/username/${username}`,
    });

    return response.data;
  },
  async createPost(text: string): Promise<TPost> {
    const response = await request<TRawPost>({
      url: `${TWITTER_API_URL}/tweets`,
      body: {text},
      method: 'POST',
    });

    return response.data;
  },
});

export default TwitterService();
