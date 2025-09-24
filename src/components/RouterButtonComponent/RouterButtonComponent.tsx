import { Box, HStack, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

//Types
import type { ChildrenSideBarDashboardProps } from "../SideBarComponent/SideBarComponent.types";

export const RouterButton: React.FC<ChildrenSideBarDashboardProps> = ({
  name,
  path,
  icon,
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <HStack
      as={Link}
      to={path}
      width="100%"
      textAlign="left"
      p={3}
      borderRadius="md"
      bg={isActive ? "gray.600" : "transparent"}
      color={isActive ? "white" : "inherit"}
      _hover={{
        bg: isActive ? "gray.600" : "gray.100",
        color: isActive ? "white" : "gray.800",
      }}
      _focus={{ border: "none", outline: "none" }}
    >
      <Icon as={icon} w={5} h={5} />
      <Box>{name}</Box>
    </HStack>
  );
};
