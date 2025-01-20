import axios from 'axios';

export const publicAxios = axios.create({
  baseURL: 'http://localhost:8080/',
});

// export const privateAxios = axios.create({
//     baseURL: 'http://localhost:8000/',
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//     },
//   });
