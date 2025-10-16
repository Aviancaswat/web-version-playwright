import { Box, Card, Center, Heading, HStack, Text } from "@chakra-ui/react";
import { Database } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { getArtefactsByRepo } from "../../github/api";
import CircleProgress from "../progressBars/CircleProgress";

const CardBillingStorage = () => {

    const [storage, setStorage] = useState<number>(0)

    useEffect(() => {
        const getActionsStorage = async () => {
            const { artifacts, total_count } = await getArtefactsByRepo()
            if (total_count === 0) return;
            let totalBytes = 0;
            artifacts.forEach(e => { totalBytes += e.size_in_bytes; })
            const byteToGb = parseFloat((totalBytes / Math.pow(1024, 3)).toFixed(2));
            setStorage(byteToGb)
        }
        getActionsStorage()
    }, [])

    return (
        <Card minW={250} height={{ base: "auto", md: 95 }} width={"100%"}>
            <HStack
                height={"100%"}
                spacing={4}
                align={"center"}
                justify={"space-between"}
                p={2}
            >
                <HStack spacing={3}>
                    <Center ml={2} className="logo" borderRadius={"xl"} h={16} w={16} bg={"rgba(186, 216, 182, .5)"}>
                        <Database size={35} color="#727D73" />
                    </Center>
                    <Box className="text">
                        <Heading as="h3" size={"sm"}>Almacenamiento usado</Heading>
                        <Text color={"gray.500"} display={{base: "none", md: "block"}}>Total de storage consumidos</Text>
                        <Text>
                            <span style={{ fontWeight: "bold" }}>{storage}</span> GB / <span style={{ fontWeight: "bold" }}>0.5</span> GB incluidos
                        </Text>
                    </Box>
                </HStack>
                <Box height={70} width={70} float={"inline-end"} display={{base: "none", md: "block"}}>
                    <CircleProgress
                        key={v4()}
                        value={parseInt(((storage / 0.5) * 100).toFixed(0))}
                        text={parseInt(((storage / 0.5) * 100).toFixed(0))}
                        textColor="#727D73"
                        strokeColor="#727D73"
                        textFontSize={25}
                    />
                </Box>
            </HStack>
        </Card>
    )
}

export default CardBillingStorage;