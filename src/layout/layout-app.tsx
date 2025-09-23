import { useState } from "react"
import { Box, HStack, IconButton } from "@chakra-ui/react"
import { FlaskConical, House, LayoutDashboard, ChevronRight, X } from "lucide-react"
import SideBarDashboard, { type ChildrenSideBarDashboardProps } from "../components/dashboard/sidebar"
import Navbar from "./navbar"

const routesConfig: ChildrenSideBarDashboardProps[] = [
    { name: "Home", path: "/", icon: House },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Configurar Test", path: "/create-test", icon: FlaskConical },
]

const SIDEBAR_WIDTH = 280 // px

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <HStack width="100vw" height="100vh" align="stretch" spacing={0}>

            <Box
                as="aside"
                width={isOpen ? `${SIDEBAR_WIDTH}px` : "0px"}
                transition="width 0.25s ease"
                overflow="hidden"
                position="relative"
                /* Quita el borde cuando esté cerrado */
                borderRightWidth={isOpen ? "1px" : "0px"}
                borderRightStyle="solid"
                borderColor="gray.200"
                bg="white"
                height="100%"
            >
                {isOpen && (
                    <IconButton
                        aria-label="Cerrar Sidebar"
                        icon={<X />}
                        size="sm"
                        variant="ghost"
                        position="absolute"
                        top="10px"
                        right="10px"
                        zIndex={2}
                        background={"white"}
                        border={"0px solid"}
                        onClick={() => setIsOpen(false)}
                    />
                )}
                <Box height="100%">
                    <SideBarDashboard childrens={routesConfig} />
                </Box>
            </Box>

            {/* Contenido principal */}
            <Box
                flex="1"
                height="100%"
                position="relative"
                /* Importante para que pueda expandirse al 100% sin overflow */
                minW="0"
            >

                {!isOpen && (
                    <>
                        <Navbar />
                        <IconButton
                            aria-label="Abrir Sidebar"
                            icon={<ChevronRight />}
                            onClick={() => setIsOpen(true)}
                            position="absolute"
                            top="10px"
                            left="10px"
                            zIndex={1000}
                        />
                    </>
                )}

                {children}
            </Box>
        </HStack>
    )
}

export default LayoutApp
