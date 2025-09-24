import { defineStyleConfig, extendTheme } from '@chakra-ui/react'
//@ts-ignore
import '@fontsource-variable/inter'

const Button = defineStyleConfig({
  baseStyle: {
    _hover: { bg: "green.500", border: "none", color: "white" },
    _focus: { border: "none", outline: "none" }
  }
})

const MenuItem = defineStyleConfig({
  baseStyle: {
    _hover: { bg: "green.500", border: "none", color: "white" },
    _focus: { border: "none", outline: "none" }
  }
})

const theme = extendTheme({
  components: {
    Button,
    MenuItem
  },
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`,
  }
})

export default theme