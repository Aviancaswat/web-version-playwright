import { Box, Card, HStack, Skeleton, SkeletonCircle, SkeletonText, Stat, StatArrow, StatHelpText, StatNumber, Text } from "@chakra-ui/react";

const SkeletonCards = () => {
    return (
        <HStack
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            flexWrap={"wrap"}
        >
            {
                [...Array(3)].map(_ => (
                    <Card
                        variant={"elevated"}
                        height={150}
                        maxWidth={250}
                        width={"100%"}
                        p={2}
                    >
                        <HStack justify={"space-between"}>
                            <Box>
                                <SkeletonText
                                    noOfLines={1}
                                    skeletonHeight='3'
                                >
                                    <Text fontWeight={500}>
                                        example text
                                    </Text>
                                </SkeletonText>
                            </Box>
                            <SkeletonCircle width={10} height={10}>
                                <Box
                                    bg="whiteAlpha.900"
                                    width={10}
                                    height={10}
                                    p={1}
                                    display={"grid"}
                                    placeContent={"center"}
                                    borderRadius={"full"}
                                    borderTop={"2px solid green"}
                                >
                                </Box>
                            </SkeletonCircle>
                        </HStack>

                        <Skeleton mt={1}>
                            <Stat width={"100%"}>
                                <StatNumber fontSize={"4xl"} display={"flex"} alignItems={"end"} gap={2}>
                                    20
                                    <Text fontSize={"md"}>{"pruebas"}</Text>
                                </StatNumber>
                                {
                                    <StatHelpText>
                                        <StatArrow
                                        />
                                        23%
                                    </StatHelpText>
                                }
                            </Stat>
                        </Skeleton>
                    </Card>
                ))
            }
        </HStack>
    )
}

export default SkeletonCards;