import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
//@ts-ignore
import '@fontsource/ubuntu';
//@ts-ignore
import '@fontsource-variable/inter';

const Button = defineStyleConfig({
  baseStyle: {
    _hover: { bg: "green.500", color: "white" },
    _focus: { outline: "none" },
    _focusVisible: { boxShadow: "none" }
  }
});

const MenuItem = defineStyleConfig({
  baseStyle: {
    _hover: { bg: "green.500", color: "white" },
    _focus: { outline: "none" }
  }
});

const theme = extendTheme({
  components: {
    Button,
    MenuItem
  },
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Ubuntu', sans-serif`,
  }
});

export default theme;