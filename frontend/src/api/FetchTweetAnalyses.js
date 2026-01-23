import axios from "axios";
import { API_BASE_URL } from "./API_Base";
//! ......................................................
//! Function
export async function fetchTweetAnalyses() {
  try {
    //! ......................................................
    //! Fetch the data from Backend
    const response = await axios.get(`${API_BASE_URL}/api/ai/tweet/analyses`);
    //! ......................................................
    //! Return the data
    return response.data;
  } catch (error) {
    //! ......................................................
    //! Catch any error
    const message = error.response?.data || error.message;
    console.error("Request failed:", message);
    throw error;
  }
}
