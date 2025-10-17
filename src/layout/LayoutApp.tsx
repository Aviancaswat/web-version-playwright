import { Box, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, FlaskConical, House, LayoutDashboard } from "lucide-react";
import { useMemo, useState } from "react";

// Data
import sideBarMenuData from "../json/SideBar/sideBarMenuData.json";

// Components
import LoadingScreenComponent from "../components/LoadingScreenComponent/LoadingScreenComponent";
import SideBarDashboard from "../components/SideBarComponent/SideBarComponent";

// Types
import type { ChildrenSideBarDashboardProps } from "../components/SideBarComponent/SideBarComponent.types";

// Animations
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SIDEBAR_WIDTH = 280;    
const SIDEBAR_COLLAPSED = 72;  

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const iconMap: Record<string, ChildrenSideBarDashboardProps["icon"]> = {
    House,
    LayoutDashboard,
    FlaskConical,
  };

  const routesConfig: ChildrenSideBarDashboardProps[] = useMemo(
    () =>
      sideBarMenuData.map((item) => ({
        name: item.name,
        path: item.path,
        icon: iconMap[item.icon],
      })),
    [],
  );

  const toggle = () => setIsOpen((v) => !v);

  return (
    <>
      <LoadingScreenComponent />

      <HStack width="100vw" height="100vh" align="stretch" spacing={0} position="relative">
        <MotionBox
          as="aside"
          initial={{ width: SIDEBAR_WIDTH }}
          animate={{ width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          overflow="visible"      
          height="100%"
          bg="blackAlpha.900"
          position="relative"
          zIndex={2}             
        >
       
          <Box height="100%" overflow="hidden">
            <SideBarDashboard
              childrens={routesConfig}
              isOpen={isOpen}
              onToggle={toggle}
            />
          </Box>

          <Tooltip label={isOpen ? "Colapsar" : "Expandir"} placement="right">
            <IconButton
              aria-label={isOpen ? "Colapsar sidebar" : "Expandir sidebar"}
              icon={isOpen ? <ChevronLeft /> : <ChevronRight />}
              size="sm"
              variant="ghost"
              position="absolute"
              top="12px"
              right="-14px"
              borderRadius="full"
              boxShadow="md"
              onClick={toggle}
              _hover={{ bg: "blackAlpha.700" }}
              bg="blackAlpha.800"
              color="white"
              zIndex={3}      
            />
          </Tooltip>
        </MotionBox>

        {/* Contenido principal */}
        <Box as="main" flex="1" p={3} height="100%" overflow="auto" bg="gray.50">
          {children}
        </Box>
      </HStack>
    </>
  );
};

export default LayoutApp;
