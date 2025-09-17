import { Box, Card, CardBody, CardFooter, Heading, Icon, Text } from "@chakra-ui/react";
import { type LucideProps } from "lucide-react";

export type CardDetailsDashProps = {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    title: string,
    value: string | number,
    type: "success" | "error" | "cancelated"
}

const CardDetailsDash: React.FC<CardDetailsDashProps> = (
    {
        icon,
        title,
        value,
        type
    }
) => {
    return (
        <Card variant={"elevated"}>
            <CardBody>
                <Box
                    borderRadius={"md"}
                    bg={type === "success" ? "green.300" : (type === "error" ? "red.300" : "whiteAlpha.300")}
                    width={10}
                    height={10}
                    p={1}
                    display={"grid"}
                    placeContent={"center"}>
                    <Icon as={icon} w={7} h={7} />
                </Box>
                <Box>
                    <Text>
                        {title}
                    </Text>
                </Box>
            </CardBody>
            <CardFooter 
            width={"100%"}
            display={"flex"}
            justifyContent={"end"}
            >
                <Heading as="h2" size={"lg"}>{value}</Heading>
            </CardFooter>
        </Card>
    )
}

export default CardDetailsDash;