import axios from 'axios';

const axiosInst = axios.default.create({
    baseURL: 'http://nginx',
    headers: {
        "Content-Type": "application/json",
    }
  });

export default axiosInst