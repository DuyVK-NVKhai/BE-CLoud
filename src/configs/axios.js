import axios from 'axios';

const axiosInst = axios.default.create({
    baseURL: 'http://localhost',
    headers: {
        "Content-Type": "application/json",
    }
  });

export default axiosInst