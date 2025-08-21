import { User } from '@/entities/user/model/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userApi = {
  async getUser(userId: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user ${userId}`);
    }
    return response.json();
  },
};