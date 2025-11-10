import { Box, Button, Card, Center, Heading, HStack, Image, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Cable, Check, CircleX, Copy, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import LogoAv from "../../assets/avianca-logo-desk.png";
import type { LucideIconType } from "../TableTagItemComponent/TableTagItemComponent.types";
import ScaleAnimationBox from "../transitions/ScaleBox";
import PulsingBox from "./PulseBox";

interface Props {
    isLoading: boolean
}

type ExampleType = {
    title: string
    icon: LucideIconType,
    colors: string[]
}

interface ExampleQuestionProps {
    index: number,
    data: ExampleType
}

const dataExamples: ExampleType[] = [
    {
        icon: LayoutDashboard,
        title: "Dame un resumen del dashboard",
        colors: ["orange.200", "orange.600"]
    },
    {
        icon: User,
        title: "Dame los usuarios con el número de ejecuciones",
        colors: ["cyan.200", "cyan.600"]
    },
    {
        icon: CircleX,
        title: "Dame las 5 ejecuciones recientemente fallidas",
        colors: ["purple.200", "purple.600"]
    },
    {
        icon: Cable,
        title: "Total de ejecuciones fallidas y exitosas",
        colors: ["green.200", "green.600"]
    }
]

const ExampleQuestionAgent: React.FC<
    ExampleQuestionProps & {
        action: (index: number, text: string) => Promise<void>,
        copyIndex: number | null
    }
> = ({ index, data: { icon: Icon, title, colors }, action, copyIndex }) => {

    return (
        <ScaleAnimationBox width={{ base: "100%", lg: "40%" }}>
            <Card
                width={{ base: "100%", lg: "100%" }}
                borderRadius={"md"}
                display={"flex"}
                flexDirection={"row"}
                gap={3}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Box
                    p={5}
                    bg={colors[0]}
                    color={colors[1]}
                    borderLeftRadius={"md"}
                >
                    <Icon />
                </Box>
                <Box pr={5}>
                    <Heading size={"sm"}>{title}</Heading>
                </Box>
                <Box>
                    <Tooltip label="Copiar" placement="top" borderRadius={"md"} color="black" bg={"white"}>
                        <Button
                            size={"sm"}
                            p={1}
                            mr={2}
                            bg={"transparent"}
                            _hover={{
                                color: "#000000",
                                bg: "gray.50"
                            }}
                            onClick={() => action(index, title)}
                        >
                            {
                                copyIndex === index ? <Check /> : <Copy size={20} />
                            }
                        </Button>
                    </Tooltip>
                </Box>
            </Card>
        </ScaleAnimationBox>
    )
}

const WelcomeAgentDashboard: React.FC<Props> = ({ isLoading }) => {

    const [copyIndex, setCopyIndex] = useState<number | null>(null);

    const handleCopyExample = async (index: number, text: string) => {
        setCopyIndex(index);
        await navigator.clipboard.writeText(text)
        setTimeout(() => {
            setCopyIndex(-1)
        }, 1000);
    }

    return (
        <>
            {
                isLoading ? (
                    <Center height={"100%"} display={"flex"} flexDirection={"column"}>
                        <PulsingBox />
                        <Heading mt={5} size={"md"}>Avianca Playwright Agent</Heading>
                    </Center>
                ) : (
                    <Box
                        height={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Box bg={"black"} color={"white"} borderRadius={"2xl"} mb={3}>
                            <Image src={LogoAv} alt="Avianca Logo" height={16} width={16} />
                        </Box>
                        <Heading size={"xl"} textAlign={"center"}>Bienvenido a <br />Avianca Playwright Agent</Heading>
                        <Text>
                            Consulta y analiza los datos del dashboard
                        </Text>
                        <Box>
                            <Heading size={"md"} mt={5}>
                                Algunas preguntas que puedes hacerme:
                            </Heading>
                        </Box>
                        <HStack
                            gap={3}
                            flexWrap={"wrap"}
                            width={{ base: "full", lg: "100%" }}
                            mt={10}
                            display={"grid"}
                            placeContent={"center"}
                        >
                            <Stack
                                width={"full"}
                                direction={{ base: "column", lg: "row" }}
                                flexWrap={"wrap"}
                                gap={5}
                                justifyContent={"center"}
                                alignItems={"center"}
                                pb={{base: 10, md: 0}}
                            >
                                {
                                    dataExamples.map((data, index) => (
                                        <ExampleQuestionAgent
                                            index={index}
                                            data={data}
                                            action={handleCopyExample}
                                            copyIndex={copyIndex}
                                        />
                                    ))
                                }
                            </Stack>
                        </HStack>
                    </Box>
                )
            }

        </>

    )
}

export default WelcomeAgentDashboard; 