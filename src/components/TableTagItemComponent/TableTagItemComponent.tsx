import { Tag, TagLeftIcon } from "@chakra-ui/react";
import {
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock5,
  Loader,
  RefreshCwOff,
} from "lucide-react";
import { useEffect, useState } from "react";

//Types
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
          return { color: "red", text: "Error", icon: CircleX };
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
    <Tag variant={"outline"} colorScheme={params?.color} p={2} minW={"100%"}>
      <TagLeftIcon as={params?.icon} />
      {params?.text}
    </Tag>
  );
};

export default TagDash;