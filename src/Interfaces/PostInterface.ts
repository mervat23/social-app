export type Posts = Post[];

export interface Post {
  _id: string;
  body?: string;
  privacy: string;
  user: User;
  sharedPost?: SharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  image?: string;
}

export interface User {
  _id: string;
  name: string;
  photo: string;
  username: string;
}

export interface User2 {
  _id: string;
  name: string;
  photo: string;
  username: string;
}

export interface SharedPost {
  _id: string;
  body: string;
  privacy: string;
  image: string;
  user: User2;
  sharedPost: any;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: any;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
}
export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
  username: string;
}
