import axios from 'axios';


const BASE_URL = 'http://localhost:8080';

// Function to retrieve the CSRF token from cookies
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  // Get the CSRF token
  const csrfToken = getCSRFToken();
  
  const headers = {
    'X-XSRF-TOKEN': csrfToken,
  };


  

export const userRegister = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/add`, userData);
      return response.data; // Return the response data (e.g., success message).
    } catch (error) {
      throw error; // Handle registration error in your component.
    }
  };
// Function to authenticate a user.
export const userLogin = async (loginData) => {
    axios.post(`${BASE_URL}/user/authenticate`, loginData, { headers })
  .then((response) => {
    // Handle successful login
  })
  .catch((error) => {
    // Handle login error
  });
  };
  

export const fetchUserData=()=>{
    return axios({
        method:'GET',
        url:`${process.env.hostUrl||'http://localhost:808'}/api/v1/auth/userinfo`,
        headers:{
            'Authorization':'Bearer '+getCSRFToken()
        }
    })
}
