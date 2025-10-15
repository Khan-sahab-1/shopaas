import axios from 'axios';
import {BASE_URL} from './apiurls';

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
    console.error('🚨 API Call Error Details:');
    console.error('➡️ Endpoint:', `${url}`);
    console.error('➡️ Method:', method);
    console.error('➡️ Payload:', data);
    console.error('➡️ Response:', error?.response?.data || error.message);
    console.error('➡️ Status:', error?.response?.status || 'No status code');

    throw error;
  }
};

export default makeApiCall;
