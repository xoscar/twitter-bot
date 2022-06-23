import fetch from 'node-fetch';
import {TPost, TRawPost} from '../types/twitter.types';
import oauthService from './oauth.service';

const {TWITTER_API_URL = ''} = process.env;

type TRequestParams = {
  url: string;
  headers?: Record<string, string>;
  body?: object;
  method?: string;
};

const request = async <T>({url, headers = {}, body, method = 'GET'}: TRequestParams): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      ...oauthService.getAuthHeader(url, method),
      ...headers,
    },
    body: JSON.stringify(body),
    method,
  });
  const json = await response.json();

  return json as T;
};

const TwitterService = () => ({
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
