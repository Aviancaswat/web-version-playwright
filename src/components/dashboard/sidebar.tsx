import {
    Box,
    Divider,
    Heading,
    Text,
    VStack
} from '@chakra-ui/react'
import type { LucideProps } from 'lucide-react'
import { RouterButton } from './router-button'

export type ChildrenSideBarDashboardProps = {
    name: string,
    path: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | undefined
}

export type SideBarDashboardProps = {
    childrens: ChildrenSideBarDashboardProps[]
}

export const SideBarDashboard: React.FC<SideBarDashboardProps> = ({ childrens }) => {

    return (
        <VStack
            p={2}
            height={"100vh"}
            maxWidth={350}
            bg={"blackAlpha.900"}
            position={"relative"}
        >
            <Box>
                <Heading
                    as="h1"
                    size={"lg"}
                    textAlign="center"
                    color={"whiteAlpha.900"}
                    mt={5}
                >
                    Avianca Playwright
                </Heading>
                <Box p="1">
                    <Text mt={2} color="gray.300" textAlign="center">
                        Gestiona tus workflows de forma automática y
                        visualiza el historial completo
                    </Text>
                    <Box mt={10}>
                        <VStack
                            spacing={0}
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            color={"whiteAlpha.900"}
                        >
                            {
                                childrens.map((child, item) => (
                                    <RouterButton key={item} {...child} />
                                ))
                            }
                        </VStack>
                    </Box>
                </Box>
                <Box
                    width="100%"
                    position={"absolute"}
                    bottom={0}
                >
                    <Divider />
                    <Text mt={3} mb={3} width="100%" textAlign="center" color={"whiteAlpha.900"}>Avianca Evolutivos - {new Date().getFullYear()}</Text>
                </Box>
            </Box>
        </VStack>
    )
}

export default SideBarDashboard