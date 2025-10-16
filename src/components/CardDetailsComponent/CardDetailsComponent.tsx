import {
  Card,
  Center,
  Heading,
  HStack,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack
} from "@chakra-ui/react";
import { Bug, CirclePause, MoveDown, MoveUp, MoveUpRight, TestTube } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import dashboardCardData from "../../json/Dashboard/dashboardCardData.json";
import { useTestStore } from "../../store/test-store";
import type { LucideIconType } from "../TableTagItemComponent/TableTagItemComponent.types";
import type { CardDetailsDashProps } from "./CardDetailsComponent.types";

const iconMap: Record<string, CardDetailsDashProps["icon"]> = {
  TestTube,
  Bug,
  CirclePause,
};

type typeDetails = "success" | "error" | "cancelled"

const iconTypeDetails: Record<typeDetails, LucideIconType> = {
  success: MoveUp,
  error: MoveDown,
  cancelled: MoveUpRight
}

const dataCardsDetailsDash: CardDetailsDashProps[] = dashboardCardData.map(
  (item) => ({
    icon: iconMap[item.icon],
    title: item.title,
    value: item.value,
    type: item.type as typeDetails,
    stat: item.stat,
    iconType: iconTypeDetails[item.type as typeDetails]
  })
);

const CardDetailsDash: React.FC = () => {
  const { dataWorkflows } = useTestStore()
  const [data, setDataCardsDetailsDash] = useState<CardDetailsDashProps[]>([]);

  useEffect(() => {
    if (dataWorkflows.length > 0) {
      const successWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "success"
      ).length;

      const failureWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "failure"
      ).length;

      const cancelledWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "cancelled"
      ).length;

      const totalWorkflows = dataWorkflows.length;

      const newData = dataCardsDetailsDash.map((card) => {
        switch (card.title) {
          case "Total exitosas":
            return {
              ...card,
              value: successWorkflows,
              stat: ((successWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total fallidas":
            return {
              ...card,
              value: failureWorkflows,
              stat: ((failureWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total canceladas":
            return {
              ...card,
              value: cancelledWorkflows,
              stat: ((cancelledWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total tiempo":
            return {
              ...card,
              value: totalWorkflows,
              stat: ((totalWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          default:
            return card;
        }
      });

      setDataCardsDetailsDash(newData);
    }
  }, [dataWorkflows]);

  return (
    <>
      {
        data.map((card, idx: number) => (
          <Card
            key={idx}
            variant={"elevated"}
            maxWidth={250}
            width={"100%"}
            p={3}
          >
            <HStack spacing={5} display={"flex"} alignItems={"center"} height={"100%"}>
              <Center
                borderRadius={"lg"}
                bg={card.type === "success" ? "rgba(163, 220, 154, .5)" : (card.type === "error" ? "rgba(240, 135, 135, .5)" : "rgba(149, 189, 255, .5)")}
                p={2}>
                <Icon as={card.icon} boxSize={7} color={card.type === "success" ? "#5D866C" : (card.type === "error" ? "#AF3E3E" : "#7286D3")} />
              </Center>
              <VStack
                display={"flex"}
                alignItems={"center"}
              >
                <Text>{card.title}</Text>
                <Heading>{card.value}</Heading>
                <Center>
                  <Tag borderRadius={"xl"} size={"md"} key={v4()} variant='subtle' colorScheme='cyan'>
                    <TagLeftIcon boxSize='12px' as={card.iconType} />
                    <TagLabel>{card.stat} %</TagLabel>
                  </Tag>
                </Center>
              </VStack>
            </HStack>
          </Card>
        ))
      }
    </>
  );
};

export default CardDetailsDash;
