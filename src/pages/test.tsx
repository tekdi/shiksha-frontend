// Home.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import useStore from "@/stores/store";
import {
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  FormLabel,
} from "@mui/material";

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const setValue = useStore((state) => state.setValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue(inputValue);
    router.push("/about");
  };

  return (
    <Box p={5}>
      <Typography variant="h4" component="h1" mb={4}>
        Input Page
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <FormLabel htmlFor="value">Enter a value</FormLabel>
          <TextField
            id="value"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a value"
            variant="outlined"
            fullWidth
            required
          />
        </FormControl>
        <button type="submit" >
          Submit
        </button>
      </form>
    </Box>
  );
};



export default Home;
