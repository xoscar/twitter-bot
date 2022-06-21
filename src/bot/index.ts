import {EventBridgeHandler} from 'aws-lambda';
import TwitterService from '../services/twitter.service';
import {TPost} from '../types/twitter.types';

export const handler: EventBridgeHandler<'twitter-cron', {text: string}, TPost> = async ({detail: {text}}) => {
  const post = await TwitterService.createPost(text);

  return post;
};
