import { Box, Card, HStack, Icon, Skeleton, SkeletonCircle, SkeletonText, Stat, StatArrow, StatHelpText, StatNumber, Text } from "@chakra-ui/react";
import { Bug, CirclePause, TestTube, type LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import { useTestStore } from "../../store/test-store";

export type CardDetailsDashProps = {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    title: string,
    value: string | number,
    type: "success" | "error" | "cancelled",
    stat: number | string
}

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total exitosas",
        value: 0,
        type: "success",
        stat: 0
    },
    {
        icon: Bug,
        title: "Total fallidas",
        value: 0,
        type: "error",
        stat: 0
    },
    {
        icon: CirclePause,
        title: "Total canceladas",
        value: 0,
        type: "cancelled",
        stat: 0
    }
]

const CardDetailsDash: React.FC = () => {

    const { dataWorkflows } = useTestStore()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [data, setDataCardsDetailsDash] = useState<CardDetailsDashProps[]>([])

    useEffect(() => {
        console.log("dataWorkflows card details: ", dataWorkflows)
        setLoading(true)

        if (dataWorkflows.length > 0) {

            const successWorkflows = dataWorkflows.filter(item => item.conclusion === "success").length;
            const failureWorkflows = dataWorkflows.filter(item => item.conclusion === "failure").length;
            const cancelledWorkflows = dataWorkflows.filter(item => item.conclusion === "cancelled").length;
            const totalWorkflows = dataWorkflows.length;

            const newData = dataCardsDetailsDash.map(card => {
                switch (card.title) {
                    case "Total exitosas":
                        return { ...card, value: successWorkflows, stat: ((successWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total fallidas":
                        return { ...card, value: failureWorkflows, stat: ((failureWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total canceladas":
                        return { ...card, value: cancelledWorkflows, stat: ((cancelledWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total tiempo":
                        return { ...card, value: totalWorkflows, stat: ((totalWorkflows / totalWorkflows) * 100).toFixed(2) }
                    default:
                        return card
                }
            })
            setDataCardsDetailsDash(newData)
        }
        setLoading(false)
    }, [dataWorkflows])

    return (
        <>
            {
                data.map(card => (
                    <Card
                        variant={"elevated"}
                        height={150}
                        maxWidth={250}
                        width={"100%"}
                        p={2}
                        bg={card.type === "success" ? "green.300" : ""}
                        borderBottom={"6px solid green"}
                    >
                        <HStack justify={"space-between"}>
                            <Box>
                                <SkeletonText
                                    isLoaded={!isLoading}
                                    noOfLines={1}
                                    skeletonHeight='3'
                                >
                                    <Text fontWeight={500}>
                                        {card.title}
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
                                    <Icon as={card.icon} w={7} h={7} />
                                </Box>
                            </SkeletonCircle>
                        </HStack>

                        <Skeleton isLoaded={!isLoading} mt={1}>
                            <Stat width={"100%"}>
                                <StatNumber fontSize={"4xl"} display={"flex"} alignItems={"end"} gap={2}>
                                    {card.value}
                                    <Text fontSize={"md"}>{"pruebas"}</Text>
                                </StatNumber>
                                {
                                    <StatHelpText>
                                        <StatArrow
                                            color={card.type === "success" ? "green.800" : (card.type === "error" ? "red.500" : "gray.800")}
                                            type={card.type === "success" ? "increase" : (card.type === "error" ? "decrease" : "decrease")}
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
    )
}

export default CardDetailsDash;