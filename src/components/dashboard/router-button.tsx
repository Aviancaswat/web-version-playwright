import { Box, HStack, Icon } from "@chakra-ui/react"
import { type LucideProps } from "lucide-react"
import { Link } from "react-router-dom"

type RouterButtonProps = {
    name: string,
    path: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | undefined
}

export const RouterButton: React.FC<RouterButtonProps> = (
    { name, path, icon }
) => {
    return (
        <HStack
            as={Link}
            to={path}
            width={"100%"}
            textAlign={"left"}
            p={3}
            borderRadius={"md"}
            _hover={{ bg: "green.500", border: "none", color: "white" }}
            _focus={{ border: "none", outline: "none" }}
        >
            <Icon as={icon} w={5} h={5} />
            <Box>
                {name}
            </Box>
        </HStack>
    )
}