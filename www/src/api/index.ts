import axios from 'axios';
import {addAxiosInterceptors} from "supertokens-website/lib/build";

const NODE_ENV = process.env.NODE_ENV
export const API_PREFIX = NODE_ENV === 'development' ? 'http://localhost:3001/' : '/'

export const API_URL = `${API_PREFIX}api/v1`

const api = axios.create({
  baseURL: API_URL
});

addAxiosInterceptors(api);

export default api;
