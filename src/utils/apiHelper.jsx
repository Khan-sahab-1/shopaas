import axios from 'axios';
import { BASE_URL } from './apiurls';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const makeApiCall = async (
  url,
  method = 'POST',
  data = {},
  customHeaders = {},
) => {
  try {
    const response = await api({
      url,
      method,
      data,
      headers: {
        ...api.defaults.headers,
        ...customHeaders,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API call error:', error?.response?.data || error.message);
    throw error;
  }
};

export default makeApiCall;
