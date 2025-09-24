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
import { useEffect, useState } from "react";

//Types
import type { CardDetailsDashProps } from "./CardDetailsComponent.types";

const CardDetailsDash: React.FC<CardDetailsDashProps> = ({
  icon,
  title,
  value,
  type,
  stat,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    let time: NodeJS.Timeout;
    
    time = setTimeout(() => {
      setLoading(false);
    }, 1000);

    () => clearTimeout(time);
  }, []);

  return (
    <Card
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
            <Text fontWeight={500}>{title}</Text>
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
            <Icon as={icon} w={7} h={7} />
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
            {value}
            <Text fontSize={"md"}>{"pruebas"}</Text>
          </StatNumber>
          {
            <StatHelpText>
              <StatArrow
                color={
                  type === "success"
                    ? "green"
                    : type === "error"
                    ? "red"
                    : "gray"
                }
                type={
                  type === "success"
                    ? "increase"
                    : type === "error"
                    ? "decrease"
                    : "decrease"
                }
              />
              {stat}%
            </StatHelpText>
          }
        </Stat>
      </Skeleton>
    </Card>
  );
};

export default CardDetailsDash;
