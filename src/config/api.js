import axios from 'axios'

const api = axios.create({
  baseURL: 'http://quaravel.test/api', // Your Laravel API URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default api