const API_BASE_URL = 'http://localhost:5001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  async getTopics() {
    const response = await fetch(`${API_BASE_URL}/topics`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch topics');
    return response.json();
  },

  async getTopic(id: string) {
    const response = await fetch(`${API_BASE_URL}/topics/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch topic');
    return response.json();
  },

  async getUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async addFavoriteTopic(userId: string, topicId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topicId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add favorite topic');
    }
    return response.json();
  },

  async removeFavoriteTopic(userId: string, topicId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${topicId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to remove favorite topic');
    return response.json();
  },

  async getFavoriteTopics(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch favorite topics');
    }
    return response.json();
  },

  async registerUser(userData: { name: string; email: string }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }
    return response.json();
  },

  async loginUser(credentials: { email: string }) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  },

  async getDailyTopic() {
    const response = await fetch(`${API_BASE_URL}/topics/daily`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch daily topic');
    return response.json();
  },

  async markTopicAsRead(topicId: string) {
    const response = await fetch(`${API_BASE_URL}/topics/${topicId}/read`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark topic as read');
    }
    return response.json();
  },

  async createTopic(title: string, content: string, categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/topics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, categoryId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create topic');
    }
    return response.json();
  },

  async getUserTopics() {
    const response = await fetch(`${API_BASE_URL}/topics/user`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user topics');
    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async createCategory(name: string, description: string) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description })
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },
};
