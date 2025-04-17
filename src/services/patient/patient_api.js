import { getData, postData, putData, deleteData } from "../api.js";

export const Login = async (data) => {
  const responseData = await postData("/auth/login", data);
  // Save the token from the parsed JSON
  localStorage.setItem("Token", responseData.token);
  console.log(responseData);
  return true;
};

export const Signup = async (data) => {
  // postData already returns the parsed response (JSON or text)
  const responseData = await postData("/auth/register", data);
  if (responseData && responseData.token) {
    localStorage.setItem("Token", responseData.token);
    console.log(responseData);
    return responseData;
  }
  throw new Error("Signup failed: no token received");
};
