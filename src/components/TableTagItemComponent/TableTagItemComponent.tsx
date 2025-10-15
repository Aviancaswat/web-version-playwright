import { Box, HStack, Tag, Text } from "@chakra-ui/react";
import {
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock5,
  Loader,
  RefreshCwOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIconType, TagDashProps } from "./TableTagItemComponent.types";

const TagDash: React.FC<TagDashProps> = ({ type }) => {
  const [params, setParams] = useState<
    { color: string; text: string; icon: LucideIconType } | undefined
  >(undefined);

  useEffect(() => {
    const getColor = (): {
      color: string;
      text: string;
      icon: LucideIconType;
    } => {
      switch (type) {
        case "success":
          return { color: "green", text: "Exitoso", icon: CircleCheck };
        case "completed":
          return { color: "green", text: "Completado", icon: CircleCheck };
        case "failure":
          return { color: "red", text: "Fallido", icon: CircleX };
        case "in_progress":
          return { color: "blue", text: "En progreso", icon: Loader };
        case "queued":
          return { color: "yellow", text: "Inicializando", icon: Clock5 };
        case "cancelled":
          return { color: "orange", text: "Cancelado", icon: RefreshCwOff };
        case "neutral":
        default:
          return {
            color: "gray",
            text: "Por definir",
            icon: CircleQuestionMark,
          };
      }
    };
    setParams(getColor());
  }, []);

  return (
    <Tag variant={"subtle"} colorScheme={params?.color} p={2} minW={"100%"} borderRadius={"full"}>
      <HStack width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box h={2} w={2} bg={params?.color} borderRadius={"full"} />
        <Text>{params?.text}</Text>
      </HStack>
    </Tag>
  );
};

export default TagDash;