import { Box, Button, Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { LucideIconType } from "../TableTagItemComponent/TableTagItemComponent.types";

export type CardHomeProps = {
    title: string;
    description?: string;
    Icon: LucideIconType;
    action?: {
        url: string;
        label: string;
    };
    cardHeight?: string;
    buttonColor?: string;
};

const CardHome: React.FC<CardHomeProps> = (props: CardHomeProps) => {
    return (
        <Card
            background={`${props.buttonColor}.100`}
            height={props.cardHeight || "100%"}
            width={{ base: "90%", lg: "100%" }}
            boxShadow={"md"}
            borderRadius="lg"
            overflow="hidden"
            className="animate__animated animate__fadeIn"
        >
            <CardHeader>
                <Box
                    color={`${props.buttonColor}.900`}
                    width={"auto"}
                >
                    <props.Icon
                        size={48}
                        style={{
                            marginRight: "8px",
                        }}
                    />
                </Box>
                <Text fontSize="xl" fontWeight="bold">{props.title}</Text>
            </CardHeader>
            <CardBody
                pt={0}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                height={"auto"}
            >
                <Text mb={4}>{props.description}</Text>
                {props.action && (
                    <Button
                        as={Link}
                        to={props.action?.url}
                        variant="solid"
                        colorScheme={props.buttonColor || "blue"}
                        width="100%"
                    >
                        {props.action?.label}
                    </Button>
                )}
            </CardBody>
        </Card >
    );
};

export default CardHome;
