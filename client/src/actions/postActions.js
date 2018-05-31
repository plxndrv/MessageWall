import axios from "axios";

import {
  ADD_POST,
  GET_ERRORS,
  GET_POST,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST
} from "./types";

//Add Post
export const addPost = postData => dispatch => {
  axios
    .post("/api/wall", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/wall")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

//Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete("/api/wall/" + id)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Add Comment
export const addComment = (postId, commentData) => dispatch => {
  axios
    .post("/api/wall/comment" + postId, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
