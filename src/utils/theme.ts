import { defineStyleConfig, extendTheme } from '@chakra-ui/react'
//@ts-ignore
import '@fontsource-variable/inter'

const Button = defineStyleConfig({
  baseStyle: {
      bg: "red",
      color: "blue"
  }
})

const theme = extendTheme({
  components: {
    Button
  },
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`,
  }
})

export default theme