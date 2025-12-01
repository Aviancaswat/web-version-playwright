import { extendTheme } from '@chakra-ui/react';
//@ts-ignore
import '@fontsource/ubuntu';
//@ts-ignore
import '@fontsource-variable/inter';

const theme = extendTheme({
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Ubuntu', sans-serif`,
  }
});

export default theme;