import {
  Box,
  Card,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { Bug, CirclePause, TestTube } from "lucide-react";
import { useEffect, useState } from "react";
import dashboardCardData from "../../json/Dashboard/dashboardCardData.json";
import { useTestStore } from "../../store/test-store";
import type { CardDetailsDashProps } from "./CardDetailsComponent.types";

const iconMap: Record<string, CardDetailsDashProps["icon"]> = {
  TestTube,
  Bug,
  CirclePause,
};

const dataCardsDetailsDash: CardDetailsDashProps[] = dashboardCardData.map(
  (item) => ({
    icon: iconMap[item.icon],
    title: item.title,
    value: item.value,
    type: item.type as "success" | "error" | "cancelled",
    stat: item.stat,
  })
);

const CardDetailsDash: React.FC = () => {
  const { dataWorkflows } = useTestStore()
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setDataCardsDetailsDash] = useState<CardDetailsDashProps[]>([]);

  useEffect(() => {
    setLoading(true)
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
    setLoading(false)
  }, [dataWorkflows]);

  return (
    <>
      {
        data.map((card, idx: number) => (
          <Card
            key={idx}
            variant={"elevated"}
            height={150}
            maxWidth={250}
            width={"100%"}
            p={2}
            borderBottom={"6px solid black"}
          >
            <HStack justify={"space-between"}>
              <Box>
                <SkeletonText isLoaded={!isLoading} noOfLines={1} skeletonHeight="3">
                  <Text fontWeight={500}>{card.title}</Text>
                </SkeletonText>
              </Box>
              <SkeletonCircle isLoaded={!isLoading} width={10} height={10}>
                <Box
                  bg="whiteAlpha.900"
                  width={10}
                  height={10}
                  p={1}
                  display={"grid"}
                  placeContent={"center"}
                  borderRadius={"full"}
                  borderTop={"2px solid black"}
                >
                  <Icon as={card.icon} w={7} h={7} />
                </Box>
              </SkeletonCircle>
            </HStack>

            <Skeleton isLoaded={!isLoading} mt={1}>
              <Stat width={"100%"}>
                <StatNumber
                  fontSize={"4xl"}
                  display={"flex"}
                  alignItems={"end"}
                  gap={2}
                >
                  {card.value}
                  <Text fontSize={"md"}>{"pruebas"}</Text>
                </StatNumber>
                {
                  <StatHelpText>
                    <StatArrow
                      color={
                        card.type === "success"
                          ? "green"
                          : card.type === "error"
                            ? "red"
                            : "gray"
                      }
                      type={
                        card.type === "success"
                          ? "increase"
                          : card.type === "error"
                            ? "decrease"
                            : "decrease"
                      }
                    />
                    {card.stat}%
                  </StatHelpText>
                }
              </Stat>
            </Skeleton>
          </Card>
        ))
      }
    </>
  );
};

export default CardDetailsDash;
