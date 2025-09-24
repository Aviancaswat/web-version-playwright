import { Box, HStack } from "@chakra-ui/react";
import { FlaskConical, House, LayoutDashboard } from "lucide-react";

//Data
import sideBarMenuData from "../json/SideBar/sideBarMenuData.json";

//Components
import SideBarDashboard from "../components/SideBarComponent/SideBarComponent";
import LoadingScreenComponent from "../components/LoadingScreenComponent/LoadingScreenComponent";

//Types
import type { ChildrenSideBarDashboardProps } from "../components/SideBarComponent/SideBarComponent.types";

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  const iconMap: Record<string, ChildrenSideBarDashboardProps["icon"]> = {
    House,
    LayoutDashboard,
    FlaskConical,
  };

  const routesConfig: ChildrenSideBarDashboardProps[] = sideBarMenuData.map(
    (item) => ({
      name: item.name,
      path: item.path,
      icon: iconMap[item.icon],
    })
  );

  return (
    <>
      <LoadingScreenComponent />
      <HStack width={"100vw"} height={"100vh"}>
        <Box minWidth={"25%"}>
          <SideBarDashboard childrens={routesConfig} />
        </Box>
        <Box width={"75%"} p={2} height={"100%"}>
          {children}
        </Box>
      </HStack>
    </>
  );
};

export default LayoutApp;
