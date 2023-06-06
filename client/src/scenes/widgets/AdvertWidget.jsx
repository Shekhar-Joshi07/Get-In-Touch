import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="https://getintouch-o3we.onrender.com/assets/adidas_india_1.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Adidas India</Typography> 
        <Typography color={medium}>https://www.adidas.co.in</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Men’s ODI CRICKET jersey is for every Indian Cricket Fan. 
      
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;