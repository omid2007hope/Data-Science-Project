import axios from "axios";
import { API_BASE_URL } from "./API_Base";

export async function fetchTweetAnalyses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/ai/tweet/analyses`);
    return response.data;
  } catch (error) {
    const message = error.response?.data || error.message;
    console.error("Request failed:", message);
    throw error;
  }
}
