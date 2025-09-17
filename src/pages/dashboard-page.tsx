import { Box, Heading, HStack } from "@chakra-ui/react"
import { Bug, CirclePause, TestTube } from "lucide-react"
import type { CardDetailsDashProps } from "../components/dashboard/card-details"
import CardDetailsDash from "../components/dashboard/card-details"

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total pruebas existosas",
        value: 150,
        type: "success"
    },
    {
        icon: Bug,
        title: "Total pruebas fallidas",
        value: 10,
        type: "error"
    },
    {
        icon: CirclePause,
        title: "Total pruebas canceladas",
        value: 5,
        type: "cancelated"
    }
]

const DashboardPage = () => {
    return (
        <Box height={"100%"}>
            <Heading as="h1" size={"lg"}>Dashboard Page</Heading>
            <Box className="container-dash" mt={5}>
                <HStack 
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                >
                    {
                        dataCardsDetailsDash.map((data, index) => (
                            <CardDetailsDash key={index} {...data} />
                        ))
                    }
                </HStack>
            </Box>
        </Box>
    )
}

export default DashboardPage