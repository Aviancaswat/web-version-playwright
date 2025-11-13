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
    MenuItem,
    Tooltip,
    useDisclosure
} from '@chakra-ui/react';
import { Bot, PanelRightOpen, Search, SquarePen } from 'lucide-react';
import { useRef } from 'react';
import { useTestStore } from '../../store/test-store';

export const SidebarHistory = () => {
    const { conversationsAPA } = useTestStore();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);

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
                                icon={<SquarePen size={20} />}
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
                                icon={<Search size={20} />}
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
                                                conversationsAPA.filter(e => e.messages.length > 0).map(e => (
                                                    <Box p={0} m={0} key={e.converdationId}>
                                                        {
                                                            <MenuItem
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
                                                                mb={1}
                                                            >
                                                                {e.messages[0].message.substring(0, 35) + "..."}
                                                            </MenuItem>
                                                        }
                                                    </Box>
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
            </Drawer>
        </>
    )
}