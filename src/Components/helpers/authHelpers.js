import Cookies from "js-cookie";
import { loginUser } from "../../api/authAPI"; // Adjust the import path as needed
import { fetchCurrentUser } from "../../api/userAPI";

/**
 * Helper function to handle user login
 * @param {Object} values - Login form values (username and password)
 * @returns {Promise<void>}
 */
export const login = async (values) => {
  try {
    // Step 1: Log in the user and get the access token
    const loginResponse = await loginUser(values);
    const { access_token } = loginResponse;

    // Step 2: Set the token in cookies
    Cookies.set("token", access_token, {
      secure: true,
      sameSite: "Strict",
      expires: 1, // Expires in 1 day
    });

    // Step 3: Fetch the current user's data
    const userResponse = await fetchCurrentUser();

    // Step 4: Store user data in local storage
    localStorage.setItem("user", JSON.stringify(userResponse));

    return userResponse; // Return user data for further use if needed
  } catch (error) {
    console.error("Login failed", error);
    throw error; // Re-throw the error for handling in the component
  }
};

/**
 * Helper function to handle user logout
 */
export const logout = () => {
  // Step 1: Remove the token from cookies
  Cookies.remove("token");

  // Step 2: Clear user data from local storage
  localStorage.removeItem("user");

  // Optional: Redirect the user to the login page or home page
  window.location.href = "/"; // Adjust the path as needed
};