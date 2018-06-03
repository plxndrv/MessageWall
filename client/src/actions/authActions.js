import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get USer token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;
      //set token to localStorage
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //Decode token to get user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginGUser = () => dispatch => {
  axios.get("/api/users/google/login").catch(err =>
    // dispatch({
    //   type: GET_ERRORS,
    //   payload: err.response.data
    // })
    console.log(err)
  );
};

// export const loginUser = () => dispatch => {
//   axios
//     .get("/api/users/google/callback")
//     .then(res => {
//       //save to local storage
//       const { token } = res.data;
//       //set token to localStorage
//       localStorage.setItem("jwtToken", token);
//       //set token to auth header
//       setAuthToken(token);
//       //Decode token to get user data
//       const decoded = jwt_decode(token);
//       //Set current user
//       dispatch(setCurrentUser(decoded));
//     })
//     .catch(err =>
//       // dispatch({
//       //   type: GET_ERRORS,
//       //   payload: err.response.data
//       // })
//       console.log(err)
//     );
// };

//Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user
export const logoutUser = () => dispatch => {
  //Remove token from localStorage
  localStorage.removeItem("jwtToken");
  //remove auth header from future requests
  setAuthToken(false);
  //set current user to {} which wil set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
