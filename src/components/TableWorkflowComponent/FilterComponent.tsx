import { Box, Button, Checkbox, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";

export type FilterProps = {
    title: string,
    data: string[]
}

const FilterComponent: React.FC<FilterProps> = ({ title, data }) => {
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
                                    <Text maxWidth={300} isTruncated>{item}</Text>
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