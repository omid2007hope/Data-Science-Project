import axios from "axios";
import { API_BASE_URL } from "./API_Base";

//! ......................................................
//! Base API function

async function API(data) {
  try {
    //! ......................................................
    //! Post(send) the data to Backend

    const response = await axios.post(`${API_BASE_URL}/api/x/user/:username`, {
      text: data,
    });

    //! ......................................................
    //! Return the data

    return response.data;

    //! ......................................................
    //! Catch any error
  } catch (error) {
    const message = error.response?.data || error.message;
    console.error("Request failed:", message);
    throw error;
  }
}

export default API;
