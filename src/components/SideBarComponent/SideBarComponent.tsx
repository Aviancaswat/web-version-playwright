import { Box, Divider, Heading, Image, Text, VStack } from "@chakra-ui/react";
import avLogo from "../../assets/avianca-logo-desk.png";

//Components
import { RouterButton } from "../RouterButtonComponent/RouterButtonComponent";

//Types
import type { SideBarDashboardProps } from "./SideBarComponent.types";

export const SideBarDashboard: React.FC<SideBarDashboardProps> = ({
  childrens,
}) => {
  return (
    <VStack
      p={2}
      height={"100vh"}
      maxWidth={320}
      bg={"blackAlpha.900"}
      position={"relative"}
    >
      <Box
        h={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box>
          <Box display={"flex"} alignItems={"center"} columnGap={2}>
            <Image src={avLogo} width={75} height={75} />
            <Heading
              as="h1"
              size={"md"}
              textAlign="center"
              color={"whiteAlpha.900"}
            >
              Avianca Playwright
            </Heading>
          </Box>
          <Text
            mt={2}
            color="whiteAlpha.900"
            textAlign="center"
            fontSize={"sm"}
          >
            Visualiza y gestiona tus workflows
          </Text>
          <Divider mt={5} />
        </Box>
        <Box p="1" h={"100%"}>
          <Box mt={10}>
            <VStack
              spacing={0}
              width="100%"
              display="flex"
              flexDirection="column"
              rowGap={4}
              color={"whiteAlpha.900"}
            >
              {childrens.map((child, item) => (
                <RouterButton key={item} {...child} />
              ))}
            </VStack>
          </Box>
        </Box>
        <Box>
          <Divider />
          <Text
            mt={3}
            mb={3}
            width="100%"
            textAlign="center"
            color={"whiteAlpha.900"}
            fontSize={"xs"}
          >
            &copy; Avianca Evolutivos - {new Date().getFullYear()}
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default SideBarDashboard;
