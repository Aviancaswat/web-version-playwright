import { Box, Card, Center, Heading, HStack, Text } from "@chakra-ui/react";
import { Hourglass } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { GetActionsMinutesBilling } from "../../github/api";
import CircleProgress from "../progressBars/CircleProgress";

const CardBillingMinutes = () => {

    const [minutes, setMinutes] = useState<number>(0)

    useEffect(() => {
        const currentMonth = '2025-10'
        const getActionsMinutes = async () => {
            const { usageItems: data } = await GetActionsMinutesBilling()
            console.log("response actions minutes: ", data)

            if (!data || data.length === 0) return;

            let totalMinutes = 0;

            data.forEach(item => {
                const itemDate = item.date.split('T')[0];
                const itemMonth = itemDate.substring(0, 7);
                if (item.product === "actions" && item.unitType === "Minutes" && itemMonth === currentMonth) {
                    totalMinutes += item.quantity;
                }
            })
            setMinutes(totalMinutes)
        }
        getActionsMinutes()
    }, [])

    return (
        <Card minW={250} height={95} width={"100%"}>
            <HStack
                height={"100%"}
                spacing={4}
                align={"center"}
                justify={"space-between"}
                p={2}
            >
                <HStack spacing={3}>
                    <Center ml={2} className="logo" borderRadius={"xl"} h={16} w={16} bg={"rgba(255, 207, 157, .5)"}>
                        <Hourglass size={35} color="#DE8F5F" />
                    </Center>
                    <Box className="text">
                        <Heading as="h3" size={"sm"}>Minutos usados</Heading>
                        <Text color={"gray.500"}>Total de minutos consumidos</Text>
                        <Text>
                            <span style={{ fontWeight: "bold" }}>{minutes}</span> min / <span style={{ fontWeight: "bold" }}>2000</span> min incluidos
                        </Text>
                    </Box>
                </HStack>
                <Box height={70} width={70} float={"inline-end"}>
                    <CircleProgress
                        key={uuid()}
                        value={parseInt(((minutes / 2000) * 100).toFixed(0))}
                        text={parseInt(((minutes / 2000) * 100).toFixed(0))}
                        textColor="#DE8F5F"
                        strokeColor="#DE8F5F"
                        textFontSize={25}
                    />
                </Box>
            </HStack>
        </Card>
    )
}

export default CardBillingMinutes;