import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tooltip,
    useDisclosure
} from '@chakra-ui/react';
import { Bot, Ellipsis, PanelRightOpen, Pencil, Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTestStore } from '../../store/test-store';

export const SidebarChatHistory = () => {
    const { conversationsAPA } = useTestStore();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);
    const [hoverChatId, setHoverChatId] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log("cambio el valor de hoverChatId: ", hoverChatId);
    }, [hoverChatId])

    return (
        <>
            <Tooltip label="Historial de chats" bg={"white"} color={"black"} borderRadius={"md"} placement='left'>
                <Button
                    ref={btnRef}
                    size={"sm"}
                    onClick={onOpen}
                    bg={"transparent"}
                    color={"white"}
                    _hover={{
                        bg: "gray.800",
                        borderColor: "transparent"
                    }}
                >
                    <PanelRightOpen />
                </Button>
            </Tooltip>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>
                        <Bot size={30} />
                    </DrawerHeader>

                    <DrawerBody>
                        <Menu>
                            <MenuItem
                                icon={<SquarePen size={15} />}
                                fontSize={14}
                                _hover={{
                                    bg: "gray.100",
                                    borderColor: "transparent"
                                }}
                                _focus={{
                                    outline: "none"
                                }}
                                mb={1}
                            >
                                Nuevo chat
                            </MenuItem>
                            <MenuItem
                                icon={<Search size={15} />}
                                fontSize={14}
                                _hover={{
                                    bg: "gray.100",
                                    borderColor: "transparent"
                                }}
                                _focus={{
                                    outline: "none"
                                }}
                            >
                                Buscar chat
                            </MenuItem>
                        </Menu>
                        <Divider mt={5} />
                        <Box mt={5}>
                            <Accordion allowToggle borderColor={"transparent"} defaultIndex={[0]}>
                                <AccordionItem>
                                    <h2>
                                        <AccordionButton
                                            _hover={{
                                                borderColor: "transparent",
                                                bg: "gray.100"
                                            }}
                                            _focus={{
                                                outline: "none"
                                            }}
                                            p={2}
                                        >
                                            <Box as='span' flex='1' textAlign='left' p={0}>
                                                Chats
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel p={0} mt={2}>
                                        <Menu>
                                            {
                                                conversationsAPA
                                                    .filter(e => e.messages.length > 0)
                                                    .map(e => (
                                                        <MenuItem
                                                            key={e.converdationId}
                                                            _hover={{
                                                                borderColor: "transparent",
                                                                bg: "gray.100"
                                                            }}
                                                            _focus={{
                                                                outline: "none"
                                                            }}
                                                            fontSize={12}
                                                            noOfLines={1}
                                                            isTruncated
                                                            onMouseEnter={() => setHoverChatId(e.converdationId)}
                                                            onMouseLeave={() => setHoverChatId(undefined)}
                                                            display={"flex"}
                                                            justifyContent={"space-between"}
                                                        >
                                                            {e.messages[0].message.substring(0, 32) + "..."}
                                                            {
                                                                hoverChatId === e.converdationId && (
                                                                    <Box>
                                                                        <Menu>
                                                                            <MenuButton
                                                                                as={Button}
                                                                                size={"sm"}
                                                                                bg={"transparent"}
                                                                                _hover={{
                                                                                    bg: "transparent",
                                                                                    borderColor: "transparent"
                                                                                }}
                                                                                _focus={{
                                                                                    bg: "transparent",
                                                                                    outline: "none"
                                                                                }}
                                                                                _active={{
                                                                                    bg: "transparent"
                                                                                }}
                                                                                height={4}
                                                                            >
                                                                                <Ellipsis size={15} />
                                                                            </MenuButton>
                                                                            <MenuList>
                                                                                <MenuItem
                                                                                    icon={<Pencil size={15} />}
                                                                                    _hover={{
                                                                                        borderColor: "transparent",
                                                                                        bg: "gray.100"
                                                                                    }}
                                                                                    _focus={{
                                                                                        outline: "none"
                                                                                    }}
                                                                                >
                                                                                    Cambiar el nombre
                                                                                </MenuItem>
                                                                                <MenuItem
                                                                                    icon={<Trash2 size={15} />}
                                                                                    _hover={{
                                                                                        borderColor: "transparent",
                                                                                        bg: "red.100"
                                                                                    }}
                                                                                    _focus={{
                                                                                        outline: "none"
                                                                                    }}

                                                                                    color={"red.400"}
                                                                                >
                                                                                    Eliminar
                                                                                </MenuItem>
                                                                            </MenuList>
                                                                        </Menu>
                                                                    </Box>
                                                                )
                                                            }
                                                        </MenuItem>
                                                    ))
                                            }
                                        </Menu>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </Box>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            variant='solid'
                            onClick={onClose}
                            borderRadius={"full"}
                            bg={"black"}
                            color={"white"}
                            size={"sm"}
                            w={"full"}
                            pointerEvents={"none"}
                        >
                            Chat APA
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer >
        </>
    )
}