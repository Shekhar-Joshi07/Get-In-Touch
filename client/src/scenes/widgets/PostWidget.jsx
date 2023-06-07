import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@mui/icons-material";
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Avatar,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost,setPosts } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isSticky
   
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;

  const patchLike = async () => {
    const response = await fetch(
      `https://getintouch-o3we.onrender.com/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    
    const updatedPost = await response.json();
    getPosts();
    dispatch(setPost({ post: updatedPost }));
    
  };

  const getPosts = async () => {
    const response = await fetch("https://getintouch-o3we.onrender.com/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };


  const addComment = async () => {
    // Making the API request to add the comment
    const response = await fetch(
      `https://getintouch-o3we.onrender.com/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment }),
      }
    );

    // Updating the post with the newly added comment
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Reset the comment input field
    setComment("");
  };

  const deletePost = async () => {
    const response = await fetch(`https://getintouch-o3we.onrender.com/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Dispatch action to remove the post from the store or update UI accordingly
      dispatch(setPost({ deletedPostId: postId }));
    } else {
      // Handle error response
    }
  };

  const updatePost = async () => {
    const response = await fetch(`https://getintouch-o3we.onrender.com/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: editedDescription }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      getPosts()
      dispatch(setPost({ post: updatedPost }));
      setEditMode(false);
    } else {
      // Handle error response
    }
  };

  const cancelEdit = () => {
    setEditedDescription(description);
    setEditMode(false);
  };

  return (
    <WidgetWrapper m="2rem 0" style={{ position: isSticky ? "sticky" : "static" }}>
      <Friend
        friendId={postUserId}
        name={name} 
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      {editMode ? (
        <InputBase
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          fullWidth
          multiline
          autoFocus
          sx={{ mt: "1rem", mb: "0.5rem" }}
        />
      ) : (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {editedDescription}
        </Typography>
      )}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://getintouch-o3we.onrender.com/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "#e04052" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="0rem">
          {loggedInUserId === postUserId && (
            <FlexBetween mr="0">
              {editMode ? (
                <>
                  <IconButton onClick={updatePost}>
                    <CheckOutlined />
                  </IconButton>
                  <IconButton onClick={cancelEdit}>
                    <CloseOutlined />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={() => setEditMode(true)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton onClick={deletePost}>
                    <DeleteOutlined />
                  </IconButton>
                </>
              )}
            </FlexBetween>
          )}
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>


      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "0.5rem",
                  mb: "0.5rem",
                }}
              >
                <Avatar
                  src={`https://getintouch-o3we.onrender.com/assets/${comment.userId.picturePath}`}
                />
                <Typography
                  sx={{ fontWeight: "500", color: main, ml: "0.5rem" }}
                >
                  {comment.userId.firstName} {comment.userId.lastName} <VerifiedIcon sx={{color:"#3290e4", textAlign:"center", marginBottom:"-2px"}} fontSize="2px"/>
                </Typography>
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "0.5rem" }}>
                  {comment.comment}
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider />
          <Box sx={{ display: "flex", alignItems: "center", mt: "0.5rem" }}>
            <InputBase
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              sx={{ flex: 1, mr: "0.5rem" }}
            />
            <IconButton onClick={addComment}>
              <SendOutlined />
            </IconButton>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;