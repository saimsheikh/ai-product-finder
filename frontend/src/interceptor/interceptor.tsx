import axios from 'axios';
import { environment } from '../constants/environment';


// Set the base URL for Axios
axios.defaults.baseURL = environment.API_URL;


// Add an interceptor for every request
axios.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    
    

    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

// Add an interceptor for every response
axios.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {

    // Check if the response status is 401
    if (error.response && error.response.status === 401) {
      
    }


    return Promise.reject(error);
  }
);

export default axios;
