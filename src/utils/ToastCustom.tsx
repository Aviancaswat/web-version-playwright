import { Flex, Image, Text } from "@chakra-ui/react";
import logoAV from "../assets/avianca-logo-desk.png";
import type { ToastType } from "./AviancaToast";

type ToastCustomProps = {
    title: string,
    type: ToastType
}

export const ToastCustom: React.FC<ToastCustomProps> = ({ title, type }) => {
    return (
        <Flex
            align="center"
            borderRadius="md"
            justify={"space-between"}
            minWidth={type === "default" ? 320 : 300}
        >
            <Text flex="1" fontSize="md" fontWeight={"bold"}>
                {title}
            </Text>
            <Image
                src={logoAV}
                alt="Logo de la avianca"
                ml={10}
                bg={"black"}
                boxSize="30px"
                borderRadius={"md"}
            />
        </Flex>
    );
}