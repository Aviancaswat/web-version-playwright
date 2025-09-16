import {
    Box,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import type { LucideProps } from 'lucide-react'
import { useEffect } from 'react'
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

    const { isOpen, onOpen } = useDisclosure()
    useEffect(() => { onOpen() })

    return (
        <>
            <Drawer
                isOpen={isOpen}
                onClose={() => { }}
                placement='left'
            >
                <DrawerContent>
                    <DrawerHeader textAlign={"center"}>Avianca Playwright</DrawerHeader>
                    <DrawerBody p="1">
                        <Text color={"gray.500"} textAlign={"center"}>
                            Gestiona tus workflows de forma automática y visualiza el historial completo de ejecuciones, con detalles sobre su estado y duración
                        </Text>
                        <Box mt={2}>
                            <VStack
                                spacing={0}
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"column"}
                            >
                                {
                                    childrens.map((child, item) => (
                                        <RouterButton
                                            key={item}
                                            {...child}
                                        />
                                    ))
                                }
                            </VStack>
                        </Box>
                    </DrawerBody>
                    <Divider />
                    <DrawerFooter width={"100%"}>
                        <Text width={"100%"} textAlign={"center"}>Avianca Evolutivos - {new Date().getFullYear()}</Text>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideBarDashboard