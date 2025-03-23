import {getData,postData,putData,deleteData} from "../api.js";

export const Login = async (data) => {
    const response = await postData("/auth",data);
    if(response.ok){
        const responseData = response.text();
        localStorage.setItem(responseData);
    }
  return true;
};