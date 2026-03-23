// This acts as a drop-in replacement for axios to bypass node package dependencies
// since npm / bun builds were failing in environment.

const BASE_URL = 'https://sastabazzarr-production.up.railway.app';

type AxiosRequestConfig = {
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
};

const createAxiosInstance = () => {
  const request = async (url: string, config: AxiosRequestConfig = {}) => {
    // Interceptor: Automatically attach token
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Spring boot typical bearer
      // Fallback if backend doesn't expect Bearer
      // headers['Authorization'] = token;
    }

    // Handle query params
    let finalUrl = `${BASE_URL}${url}`;
    if (config.params) {
      const queryString = new URLSearchParams(config.params).toString();
      finalUrl += `?${queryString}`;
    }

    try {
      const response = await fetch(finalUrl, {
        method: config.method || 'GET',
        headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
      });

      // Attempt to parse JSON response
      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }

      if (!response.ok) {
        // Axios throws an error on non-2xx status
        throw {
          response: {
            status: response.status,
            data,
            statusText: response.statusText
          },
          message: data?.message || data?.error || 'Request failed'
        };
      }

      // Axios returns a wrapping object with 'data'
      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      // Re-throw so caller can catch it like an axios error
      throw error;
    }
  };

  return {
    get: (url: string, config?: AxiosRequestConfig) => request(url, { ...config, method: 'GET' }),
    post: (url: string, data?: any, config?: AxiosRequestConfig) => request(url, { ...config, method: 'POST', data }),
    put: (url: string, data?: any, config?: AxiosRequestConfig) => request(url, { ...config, method: 'PUT', data }),
    delete: (url: string, config?: AxiosRequestConfig) => request(url, { ...config, method: 'DELETE' }),
    patch: (url: string, data?: any, config?: AxiosRequestConfig) => request(url, { ...config, method: 'PATCH', data }),
  };
};

const axios = createAxiosInstance();
export default axios;
