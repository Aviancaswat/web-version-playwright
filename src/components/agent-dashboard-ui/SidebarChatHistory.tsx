import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Center,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import { Bot, Ellipsis, MessageCircleMore, MessageCircleOff, PanelRightOpen, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from "uuid";
import { ConversationService } from '../../firebase/firestore/services/conversation.service';
import { useTestStore } from '../../store/test-store';
import AviancaToast from '../../utils/AviancaToast';
import { ModalSearchChats } from './ModalSearchChats';
import { ModalUpdateChatName } from './ModalUpdateChatName';

export const SidebarChatHistory = () => {
    const {
        conversationsAPA,
        setCurrentConversationId,
        setCurrentMessages
    } = useTestStore();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);
    const [hoverChatId, setHoverChatId] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log("cambió conversationsAPA: ", conversationsAPA);
    }, [conversationsAPA])

    const handleDeleteChat = async (conversationId: string) => {
        if (!conversationId) return;

        try {

            await ConversationService.deleteConversation(conversationId);
            AviancaToast.success("Chat eliminado", {
                description: "El chat se ha eliminado correctamente",
            });

        } catch (error) {
            console.error("Error eliminando chat:", error);
            AviancaToast.error("Error al eliminar el chat");
        }
    };

    const createNewChat = async () => {
        const newId = uuid();
        setCurrentConversationId(newId);
        setCurrentMessages([]);
        console.log("Nuevo chat creado:", newId);
        onClose();
    };

    const setChatSelectedUser = (conversationId: string) => {
        if (conversationId.trim().length === 0) return;
        const conversationFind = conversationsAPA.find(e => e.converdationId === conversationId);
        if (!conversationFind) return;
        setCurrentConversationId(conversationFind.converdationId);
        setCurrentMessages(conversationFind.messages);
        onClose();
    }

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
                                onClick={createNewChat}
                            >
                                Nuevo chat
                            </MenuItem>
                            <ModalSearchChats onCloseSidebar={onClose} />
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
                                                conversationsAPA.length === 0 && (
                                                    <Center height={"100%"}>
                                                        <VStack>
                                                            <MessageCircleOff size={40} />
                                                            <Text fontSize={"sm"} textAlign={"center"}>
                                                                Aún no tienes conversaciones. Inicia un nuevo chat para comenzar.
                                                            </Text>
                                                        </VStack>
                                                    </Center>
                                                )
                                            }
                                            {
                                                conversationsAPA
                                                    .filter(e => e.messages.length > 0)
                                                    .map(e => (
                                                        <MenuItem
                                                            key={e.converdationId}
                                                            _hover={{ borderColor: "transparent", bg: "gray.100" }}
                                                            _focus={{ outline: "none" }}
                                                            fontSize={12}
                                                            noOfLines={1}
                                                            isTruncated
                                                            onMouseEnter={() => setHoverChatId(e.converdationId)}
                                                            onMouseLeave={() => setHoverChatId(undefined)}
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            minW="unset"
                                                            pr={2}
                                                        >
                                                            <HStack
                                                                as={Button}
                                                                variant="unstyled"
                                                                onClick={() => setChatSelectedUser(e.converdationId)}
                                                                size="sm"
                                                                _hover={{ bg: "gray.100", borderColor: "transparent" }}
                                                                _focus={{ outline: "none" }}
                                                                fontSize={12}
                                                                p={0}
                                                                m={0}
                                                                alignItems="center"
                                                            >
                                                                <MessageCircleMore style={{ width: 15, height: 15 }} />

                                                                <Text isTruncated maxW="200px">
                                                                    {e.title?.substring(0, 35)}
                                                                    {e.title?.length! >= 35 ? "..." : ""}
                                                                </Text>
                                                            </HStack>

                                                            {hoverChatId === e.converdationId && (
                                                                <Menu>
                                                                    <MenuButton
                                                                        as={Button}
                                                                        size="sm"
                                                                        bg="transparent"
                                                                        _hover={{ bg: "transparent", borderColor: "transparent" }}
                                                                        _focus={{ outline: "none" }}
                                                                        _active={{ bg: "transparent" }}
                                                                        height={4}
                                                                        minW="unset"
                                                                    >
                                                                        <Ellipsis style={{ width: 15, height: 15 }} />
                                                                    </MenuButton>

                                                                    <MenuList p="0px 1px 2px 1px">
                                                                        <ModalUpdateChatName conversationId={e.converdationId} />

                                                                        <MenuItem
                                                                            icon={<Trash2 style={{ width: 15, height: 15 }} />}
                                                                            _hover={{ bg: "red.100", borderColor: "transparent" }}
                                                                            _focus={{ outline: "none" }}
                                                                            color="red.400"
                                                                            onClick={() => handleDeleteChat(e.converdationId)}
                                                                        >
                                                                            Eliminar
                                                                        </MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            )}
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