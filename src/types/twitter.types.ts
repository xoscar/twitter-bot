export type TUser = {
  id: string;
  name: string;
  username: string;
};

export type TRawUser = {
  data: TUser;
};

export type TPost = {
  id: string;
  text: string;
};

export type TRawPost = {
  data: TPost;
};
