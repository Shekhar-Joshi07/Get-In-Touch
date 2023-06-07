import { Box, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import WidgetWrapper from "components/WidgetWrapper";
import PeopleIcon from '@mui/icons-material/People';

const ProfilePage = ({ isSticky }) => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`https://getintouch-o3we.onrender.com/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >


         <WidgetWrapper width="24%" display={isNonMobileScreens?"block":"none"} style={{height:"fit-content", padding:"0rem", }}>
          <FriendListWidget userId={userId} />
        </WidgetWrapper>
       
          
      
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
         
        </Box>

        <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <WidgetWrapper width="100%" display={isNonMobileScreens ? "none" : "block"} style={{ height: "fit-content", padding: "0rem", position: isSticky ? "sticky" : "static" }}>
            <Accordion>
              <AccordionSummary style={{fontSize:"16px"}}> See your friend list <PeopleIcon sx={{fontSize:"20px", marginTop:"2px", marginLeft:"10px"}}/> </AccordionSummary>
              <AccordionDetails>
                <FriendListWidget userId={userId} />
              </AccordionDetails>
            </Accordion>
          </WidgetWrapper>
          <PostsWidget userId={userId} isProfile />
          
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
