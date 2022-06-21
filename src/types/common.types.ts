export type TPost = {
  text: string;
  cron: string;
};

export type TApi = {
  twitter: {
    url: string;
    credentials: {
      bearerToken: string;
      apiKey: string;
      apiSecret: string;
      oauthToken: string;
      oauthTokenSecret: string;
    };
  };
};

export type TConfig = {
  postList: TPost[];
  api: TApi;
};
