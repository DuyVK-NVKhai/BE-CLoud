import axios from 'axios';

const axiosInst = axios.default.create({
    baseURL: 'http://localhost',
    headers: {
        "Content-Type": "application/json",
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTU5NzUzNjgsImlhdCI6MTYxNTkzOTM2OCwiaXNzIjoibWFpbmZsdXguYXV0aCIsInN1YiI6InBpQGdtYWlsLmNvbSIsImlzc3Vlcl9pZCI6ImE4NzFjMDgyLTI2OGItNDEzNS1iZGY5LWUyMTAzMDU4ZTZiMCIsInR5cGUiOjB9.qyJ5laJ6WtJbQAohaaty9ciH5Oq3ANt33qe45Gz2yGY"
    }
  });

export default axiosInst