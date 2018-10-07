import axios from 'axios';

const GLOVO_API = axios.create({
  baseURL: process.env.GLOVO_API_URI,
  headers: {
    'x-api-key': process.env.GLOVO_API_AUTH,
  },
});

export default {

  getProducts() {
    return GLOVO_API.get('/products');
  },

  getPrices(product) {
    return GLOVO_API.get(`/products/${product}/prices`);
  },
};
