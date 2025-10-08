import { Avatar, Box, Button, Checkbox, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Tag, TagLabel, Text } from "@chakra-ui/react";
import { debounce } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTestStore, type FilterGeneric } from "../../store/test-store";

export type FilterType = 'autor' | 'workflow' | 'status' | 'result'

export type FilterProps = {
    title: string,
    data: string[],
    type: FilterType
}

const FilterComponent: React.FC<FilterProps> = ({ title, data, type }) => {
    const { dataWorkflows, selectedFilters, setSelectedFilters } = useTestStore();
    const [dataFilter, setDataFilter] = useState<string[]>(data);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = useCallback(
        debounce((value: string) => {
            const filteredItems = data.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setDataFilter(filteredItems);
        }, 300),
        [data]
    );

    useEffect(() => {
        if (!searchTerm) {
            setDataFilter(data);
        }
    }, [searchTerm, data, dataWorkflows, selectedFilters]);

    const parseValues = (value: string | undefined): React.ReactElement | string => {
        const values: Record<string, React.ReactElement> = {
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
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='red'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"red"} mr={2} />
                    <TagLabel>Fallido</TagLabel>
                </Tag>
            ),
            "neutral": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='gray'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"gray"} mr={2} />
                    <TagLabel>Neutro</TagLabel>
                </Tag>
            ),
            "cancelled": (
                <Tag size={"md"} borderRadius={"full"} variant='subtle' colorScheme='orange'>
                    <Box h={2} w={2} borderRadius={"full"} bg={"orange"} mr={2} />
                    <TagLabel>Cancelado</TagLabel>
                </Tag>
            ),
        };
        return value && values.hasOwnProperty(value) ? values[value] : "Por definir";
    };

    const findUserAvatar = (username: string) => {
        const findUser = dataWorkflows.find(e => e?.actor?.autorname === username);
        return findUser?.actor?.avatar;
    };

    const handleKeyUpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const findType = selectedFilters.find(e => e.type === type);
        let newFilters: FilterGeneric[];

        const exists = selectedFilters.some(
            (filter) => filter.type === type && filter.values.includes(value)
        );
        if (!findType) {
            newFilters = [...selectedFilters, { type, values: [value] }];
        } else {
            const updatedValues = [...findType.values];
            const index = selectedFilters.findIndex((filter) => filter.type === type);

            if (exists) {
                const newValues = updatedValues.filter(val => val !== value);
                newFilters = newValues.length > 0
                    ? [
                        ...selectedFilters.slice(0, index),
                        { type, values: newValues },
                        ...selectedFilters.slice(index + 1)
                    ]
                    : [
                        ...selectedFilters.slice(0, index),
                        ...selectedFilters.slice(index + 1)
                    ];
            } else {
                updatedValues.push(value);
                newFilters = [
                    ...selectedFilters.slice(0, index),
                    { type, values: updatedValues },
                    ...selectedFilters.slice(index + 1),
                ];
            }
        }

        setSelectedFilters(newFilters);
    };

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
            <MenuList maxHeight={200} overflowY={"auto"}>
                <Box width={"90%"} m="0px auto 10px auto">
                    {type === "workflow" && (
                        <Input
                            variant={"filled"}
                            placeholder='Escribe el nombre'
                            size='sm'
                            borderRadius={"md"}
                            value={searchTerm}
                            onChange={handleKeyUpInput}
                        />
                    )}
                </Box>
                {
                    dataFilter.length > 0 ? (
                        dataFilter.map((item, idx) => (
                            <MenuItem
                                key={idx}
                                border={"none"}
                                _hover={{
                                    background: "gray.100",
                                    border: "none",
                                    outline: "none",
                                }}
                                _focus={{
                                    outline: "none"
                                }}
                            >
                                <Checkbox
                                    size='md'
                                    colorScheme="blackAlpha"
                                    width={"100%"}
                                    isChecked={selectedFilters.some(e => e.values.includes(item))}
                                    onChange={handleFilterChange}
                                    value={item}
                                >
                                    <HStack>
                                        {type === "autor" && (
                                            <Avatar size='xs' name={item} src={findUserAvatar(item)} />
                                        )}
                                        <Text maxWidth={300} isTruncated>
                                            {type === "status" || type === "result" ? parseValues(item) : item}
                                        </Text>
                                    </HStack>
                                </Checkbox>
                            </MenuItem>
                        ))
                    ) : (
                        (type === "workflow" && searchTerm.length !== 0) ? (
                            <Text minHeight={100} display={"grid"} placeContent={"center"}>Sin resultados</Text>
                        ) : (
                            <Box minHeight={100} display={"grid"} placeContent={"center"}>
                                <Spinner />
                            </Box>
                        )
                    )
                }
            </MenuList>
        </Menu>
    );
};

export default FilterComponent;
