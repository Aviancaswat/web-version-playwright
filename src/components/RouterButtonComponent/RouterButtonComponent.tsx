// components/RouterButtonComponent/RouterButtonComponent.tsx
import { HStack, Icon, Box, chakra } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import type { ChildrenSideBarDashboardProps } from "../SideBarComponent/SideBarComponent.types";

const LinkStyled = chakra(Link, {
  baseStyle: {
    textDecoration: "none",
    display: "block",
    width: "100%",
  },
});

type RouterButtonProps = ChildrenSideBarDashboardProps & {
  showLabel?: boolean;
};

export const RouterButton: React.FC<RouterButtonProps> = ({
  name,
  path,
  icon,
  showLabel = true,
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <LinkStyled to={path}>
      <HStack
        fontWeight={isActive ? "bold" : "light"}
        p={1}
        m={2}
        spacing={showLabel ? 3 : 0}
        justifyContent={showLabel ? "flex-start" : "center"}
        color="whiteAlpha.900"
        borderBottom={isActive ? "2px solid white" : "2px solid transparent"}
        _hover={{
          borderBottom: "2px solid white",
          fontWeight: "bold",
        }}
        _active={{
          borderBottom: "2px solid white",
        }}
        _focus={{
          outline: "none",
        }}
        transition="all .2s ease"
        sx={{
          "&, & *": { textDecoration: "none !important" },
        }}
      >
        <Icon as={icon} boxSize={5} />
        {showLabel ? <Box as="span">{name}</Box> : null}
      </HStack>
    </LinkStyled>
  );
};
