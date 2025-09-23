// src/layout/navbar.tsx
import { Box, Flex, Image } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import logoAvianca from "../assets/avianca-icon.png"

export const NAVBAR_H = "63px"

const Navbar = () => {
  return (
    <Box
      as="header"
      h={NAVBAR_H}
      w="full"                // ✅ no uses 100vw aquí
      maxW="100%"
      boxSizing="border-box"  // ✅ evita overflow por padding/border
      borderBottomWidth="1px"
      borderColor="gray.200"
      bg="black"
      px={4}
      position="sticky"
      top={0}
      zIndex={10}
      overflowX="clip"        // “cinturón de seguridad” ante descendientes traviesos
    >
      <Flex align="center" h="100%">
        <RouterLink to="/">
          <Image
            src={logoAvianca}
            alt="logo avianca"
            h="28px"
            maxW="100%"
            m={0}             // ❌ quita el margin grande
            display="block"   // evita gap de inline elements
            objectFit="contain"
          />
        </RouterLink>
      </Flex>
    </Box>
  )
}

export default Navbar
