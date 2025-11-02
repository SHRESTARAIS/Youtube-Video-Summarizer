const DEV = true;
const baseDev = 'http://localhost:8000'; // when running backend locally
const baseProd = 'https://your-backend.example.com';

export default {
  baseUrl: DEV ? baseDev : baseProd,
};
