import OAuth from 'oauth-1.0a';
import {createHmac} from 'crypto';

const {
  TWITTER_API_KEY = '',
  TWITTER_API_SECRET = '',
  TWITTER_OAUTH_TOKEN = '',
  TWITTER_OAUTH_TOKEN_SECRET = '',
} = process.env;

const oauth = new OAuth({
  consumer: {
    key: TWITTER_API_KEY,
    secret: TWITTER_API_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => createHmac('sha1', key).update(baseString).digest('base64'),
});

const OAuthService = () => ({
  getAuthHeader(url: string, method = 'GET') {
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
  },
});

export default OAuthService();
