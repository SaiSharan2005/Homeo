import {getData,postData,putData,deleteData} from "../api.js";

export const Login = async (data) => {
    const response = await postData("/auth/login",data);
    if(response.ok){
        const responseData = response.json();
        localStorage.setItem("Token", responseData.token);
        console.log(responseData);
        }
  return true;
};

export const Signup = async (data) => {
  const response = await postData("/auth/register", data);
  if (response.ok) {
    const responseData = await response.json();
    localStorage.setItem("Token", responseData.token);
    console.log(responseData);
    return true;
  }
  const errorMessage = await response.text();
  throw new Error(errorMessage);
};
