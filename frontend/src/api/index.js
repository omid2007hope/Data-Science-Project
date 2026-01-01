import axios from "axios";

const API_BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

async function API(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/x/user/:username`, {
      text: data,
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data || error.message;
    console.error("Request failed:", message);
    throw error;
  }
}

export default API;
