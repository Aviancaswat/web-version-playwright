import { extendTheme } from '@chakra-ui/react'
//@ts-ignore
import '@fontsource-variable/inter'

const theme = extendTheme({
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`,
  }
})

export default theme