import { Box, Divider, Heading, Image, Text, VStack, Tooltip } from "@chakra-ui/react";
import avLogo from "../../assets/avianca-logo-desk.png";
import { RouterButton } from "../RouterButtonComponent/RouterButtonComponent";
import type { SideBarDashboardProps } from "./SideBarComponent.types";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);
const MotionImage = motion(Image);
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const menuItemVariants = {
  open: { opacity: 1, x: 0, transition: { duration: 0.18 } },
  collapsed: { opacity: 1, x: 0, transition: { duration: 0.18 } },
};

export const SideBarDashboard: React.FC<
  SideBarDashboardProps & { isOpen?: boolean; onToggle?: () => void }
> = ({ childrens, isOpen = true }) => {
  return (
    <MotionVStack
      p={2}
      height="100vh"
      maxW="full"
      bg="transparent"
      position="relative"
      align="stretch"
      spacing={0}
      initial={false}
      animate={{ opacity: 1 }}
    >
      <Box h="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <MotionBox
          px={2}
          pt={2}
          animate={{ height: isOpen ? 250 : 80 }}
          transition={{ duration: 0.26 }}
          overflow="hidden"
        >
          
          <MotionBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            h="100%"
            animate={{ gap: isOpen ? 8 : 4 }} 
            transition={{ duration: 0.2 }}
          >
            <MotionImage
              src={avLogo}
              animate={{
                width: isOpen ? "6rem" : "4rem",
                height: isOpen ? "6rem" : "3rem",
              }}
              transition={{ duration: 0.26 }}
            />
            <MotionBox
              initial={false}
              animate={{
                maxWidth: isOpen ? 260 : 0,
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.98,
              }}
              transition={{ duration: 0.2 }}
              overflow="hidden"
              textAlign="center"
              sx={{ "& *": { maxWidth: "100%" } }}
            >
              <MotionHeading
                as="h1"
                color="whiteAlpha.900"
                initial={false}
                animate={{
                  fontSize: isOpen ? "0.875rem" : "0.75rem",
                  lineHeight: isOpen ? "1.25rem" : "1rem",
                }}
                transition={{ duration: 0.2 }}
                noOfLines={1}
              >
                Avianca Playwright
              </MotionHeading>

              <MotionText
                color="whiteAlpha.900"
                initial={false}
                animate={{
                  fontSize: isOpen ? "0.75rem" : "0.625rem",
                  lineHeight: isOpen ? "1rem" : "0.875rem",
                }}
                transition={{ duration: 0.2 }}
                noOfLines={1}
              >
                Visualiza y gestiona tus workflows
              </MotionText>
            </MotionBox>
          </MotionBox>
          <Divider mt={2} borderColor="whiteAlpha.400" />
        </MotionBox>

        <MotionBox p="1" h="100%" layout>
          <MotionVStack
            layout
            spacing={0}
            width="100%"
            display="flex"
            flexDirection="column"
            color="whiteAlpha.900"
            align="stretch"
          >
            {childrens.map((child, idx) => {
              const item = (
                <RouterButton key={idx} {...child} showLabel={isOpen} />
              );

              return (
                <MotionBox
                  key={idx}
                  layout
                  variants={menuItemVariants}
                  animate={isOpen ? "open" : "collapsed"}
                >
                  {isOpen ? (
                    item
                  ) : (
                    <Tooltip placement="right" label={child.name}>
                      <Box>{item}</Box>
                    </Tooltip>
                  )}
                </MotionBox>
              );
            })}
          </MotionVStack>
        </MotionBox>

        {/* Footer */}
        <Box px={2} pb={3}>
          <Divider borderColor="whiteAlpha.400" />
          {isOpen && (
            <Text
              mt={3}
              mb={1}
              width="100%"
              textAlign="center"
              color="whiteAlpha.900"
              fontSize="xs"
            >
              &copy; Avianca Evolutivos - {new Date().getFullYear()}
            </Text>
          )}
        </Box>
      </Box>
    </MotionVStack>
  );
};

export default SideBarDashboard;
