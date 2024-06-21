// DisplayPage.js
import React, {useEffect, useState} from "react";
import useStore from "@/stores/store";
import { Box } from "@mui/material";

const About = () => {
  const store = useStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Box p={5}>
      <h1>Display Page</h1>
      <p>Value from Input Page: {store.value}</p>
    </Box >
  );
};

export default About;

