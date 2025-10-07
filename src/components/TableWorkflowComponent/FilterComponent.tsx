import { Avatar, Box, Button, Checkbox, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Tag, TagLabel, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { useTestStore } from "../../store/test-store";

export type FilterProps = {
    title: string,
    data: string[],
    type: 'autor' | 'workflow' | 'status' | 'result'
}

const FilterComponent: React.FC<FilterProps> = ({ title, data, type }) => {

    const { dataWorkflows } = useTestStore()
    const parseValues = (value: string | undefined): React.ReactElement | string => {
        let values: Record<string, React.ReactElement> = {
            "queued": (
                <Tag size={"md"} variant='subtle' colorScheme='gray'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"gray"} mr={2} />
                    <TagLabel>En cola</TagLabel>
                </Tag>
            ),
            "in_progress": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='blue'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"blue"} mr={2} />
                    <TagLabel>En progreso</TagLabel>
                </Tag>
            ),
            "completed": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='green'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"green"} mr={2} />
                    <TagLabel>Completado</TagLabel>
                </Tag>
            ),
            "success": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='green'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"green"} mr={2} />
                    <TagLabel>Exitoso</TagLabel>
                </Tag>
            ),
            "failure": (
                (
                    <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='red'>
                        <Box h={2} w={2} borderRadius={"full"} bg={"red"} mr={2} />
                        <TagLabel>Fallido</TagLabel>
                    </Tag>
                )
            ),
            "neutral": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='gray'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"gray"} mr={2} />
                    <TagLabel>Neutro</TagLabel>
                </Tag>
            ),
            "cancelled": (
                (
                    <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='orange'>
                        <Box h={2} w={2} borderRadius={"full"} bg={"orange"} mr={2} />
                        <TagLabel>Cancelado</TagLabel>
                    </Tag>
                )
            ),
        }
        return value && values.hasOwnProperty(value) ? values[value] : "Por definir";
    }

    const findUserAvatar = (username: string) => {
        const findUser = dataWorkflows.find(e => e?.actor?.autorname === username)
        if (!findUser) return undefined;
        return findUser?.actor?.avatar
    }

    return (
        <Menu closeOnSelect={false}>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon size={15} />}
                size={"xs"}
                bg="transparent"
                color={"black"}
                borderColor={"black"}
            >
                {title}
            </MenuButton>
            <MenuList
                maxHeight={200}
                overflowY={"auto"}
            >
                <Box width={"90%"} m="0px auto 10px auto">
                    {
                        type === "workflow" && (
                            <Input placeholder='Escribe el nombre' size='sm' borderRadius={"md"} />
                        )
                    }
                </Box>
                {
                    data.length > 0 ? (
                        data.map((item, idx) => (
                            <MenuItem
                                key={idx}
                                border={"none"}
                                _hover={{
                                    background: "gray.100",
                                    border: "none",
                                    outline: "none",
                                }}
                                _focus={{
                                    outline: "none",
                                }}
                            >
                                <Checkbox
                                    size='md'
                                    colorScheme="blackAlpha"
                                    width={"100%"}
                                >
                                    <HStack>
                                        <>
                                            {
                                                type === "autor" && (
                                                    <Avatar size='xs' name='' src={findUserAvatar(item)} />
                                                )
                                            }
                                        </>
                                        <Text maxWidth={300} isTruncated>
                                            {
                                                (type === "status" || type === "result") ? parseValues(item) : item
                                            }
                                        </Text>
                                    </HStack>
                                </Checkbox>
                            </MenuItem>
                        ))
                    ) :
                        (
                            <Box minHeight={100} display={"grid"} placeContent={"center"}>
                                <Spinner />
                            </Box>
                        )
                }
            </MenuList>
        </Menu>
    )
}

export default FilterComponent;