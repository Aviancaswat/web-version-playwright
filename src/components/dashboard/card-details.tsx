import { Box, Card, HStack, Icon, Skeleton, SkeletonCircle, SkeletonText, Stat, StatArrow, StatHelpText, StatNumber, Text } from "@chakra-ui/react";
import { type LucideProps } from "lucide-react";
import { useEffect, useState } from "react";

export type CardDetailsDashProps = {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    title: string,
    value: string | number,
    type: "success" | "error" | "cancelated" | "time"
}

const CardDetailsDash: React.FC<CardDetailsDashProps> = (
    {
        icon,
        title,
        value,
        type
    }
) => {

    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true)
        let time: NodeJS.Timeout;
        time = setTimeout(() => {
            setLoading(false)
        }, 5000);

        () => clearTimeout(time)
    }, [])

    return (
        <Card
            variant={"elevated"}
            height={150}
            maxWidth={200}
            width={"40%"}
            p={2}
            bg={type === "success" ? "green.300" : ""}
            borderBottom={"6px solid green"}
        >
            <HStack justify={"space-around"}>
                <Box>
                    <SkeletonText
                        isLoaded={!isLoading}
                        noOfLines={1}
                        skeletonHeight='3'
                    >
                        <Text fontWeight={500}>
                            {title}
                        </Text>
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
                        borderTop={"2px solid green"}
                    >
                        <Icon as={icon} w={7} h={7} />
                    </Box>
                </SkeletonCircle>
            </HStack>

            <Skeleton isLoaded={!isLoading} mt={1}>
                <Stat width={"100%"}>
                    <StatNumber fontSize={"4xl"} display={"flex"} alignItems={"end"} gap={2}>
                        {value}
                        <Text fontSize={"md"}>{type === "time" ? "horas" : "pruebas"}</Text>
                    </StatNumber>
                    <StatHelpText>
                        <StatArrow
                            color={type === "success" ? "green.800" : (type === "error" ? "red.500" : "gray.800")}
                            type={type === "success" ? "increase" : (type === "error" ? "decrease" : "decrease")}
                        />
                        23.36%
                    </StatHelpText>
                </Stat>
            </Skeleton>
        </Card>
    )
}

export default CardDetailsDash;