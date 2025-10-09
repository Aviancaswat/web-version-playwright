import { Box, Flex, Image, Text } from "@chakra-ui/react";
import logoAV from "../assets/avianca-logo-desk.png";

type ToastCustomProps = {
    title?: string,
    message: string,
}

export const ToastCustom: React.FC<ToastCustomProps> = (
    {
        title,
        message
    }
) => {
    return (
        <Flex
            align="center"
            borderRadius="md"
            justify={"space-between"}
            minWidth={300}
        >
            <Box display={"flex"} gap={1} flexDirection={"column"}>
                {
                    title && (<Text flex="1" fontSize="md" fontWeight={"bold"}>
                        {title}
                    </Text>)
                }
                <Text flex="1" fontSize="md" color={ title ? "gray.700" : "blackAlpha.900"}>
                    {message}
                </Text>
            </Box>
            <Image
                src={logoAV}
                alt="Logo de la empresa"
                bg={"black"}
                boxSize="35px"
                ml="10px"
                borderRadius={"md"}
            />
        </Flex>
    );
}