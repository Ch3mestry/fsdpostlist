import { Comment, CreateCommentDto } from "../model/types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const commentApi = {
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
    return response.json();
  },

  async createComment(comment: CreateCommentDto): Promise<Comment> {
    const response = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return response.json();
  },
};
