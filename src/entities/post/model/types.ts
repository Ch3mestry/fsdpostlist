export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostWithImage extends Post {
  imageUrl: string;
}
