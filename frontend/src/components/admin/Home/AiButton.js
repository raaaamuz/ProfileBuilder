import React, { useState } from "react";
import { Box, Avatar, Typography, Slide, CircularProgress } from "@mui/material";
import RobotIcon from '@mui/icons-material/SmartToy';

const AiButton = ({ isImproving, handleImproveDescription }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        cursor: isImproving ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!isImproving ? handleImproveDescription : undefined}
    >
      <Avatar
        sx={{
          bgcolor: isImproving ? "grey.500" : "primary.main",
          width: 56,
          height: 56,
        }}
      >
        {isImproving ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <RobotIcon fontSize="small" />
        )}
      </Avatar>
      <Slide
        direction="right"
        in={hovered}
        mountOnEnter
        unmountOnExit
        timeout={600}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "70px",
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            boxShadow: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="caption" color="text.primary">
            AI
          </Typography>
        </Box>
      </Slide>
    </Box>
  );
};

export default AiButton;
