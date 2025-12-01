import { Box, Center, Heading, HStack, Input, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure } from "@chakra-ui/react";
import { debounce } from "lodash";
import { MessageCircleMore, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTestStore, type ConversationsAPA } from "../../store/test-store";
import AnimatedLoader from "../loaders/AnimatedLoader";

export const ModalSearchChats = ({onCloseSidebar}: {onCloseSidebar: Function}) => {

    const { conversationsAPA: data, setCurrentConversationId, setCurrentMessages } = useTestStore()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [dataFilter, setDataFilter] = useState<ConversationsAPA[]>(data)
    const [valueSearchChat, setSearchChat] = useState<string>('');

    useEffect(() => {
        if (!valueSearchChat) {
            setDataFilter(data);
        }
    }, [valueSearchChat, data]);

    const handleSearch = useCallback(
        debounce((value: string) => {
            const filteredItems = data.filter(item =>
                item.title?.toLowerCase().includes(value.toLowerCase())
            );
            setDataFilter(filteredItems);
        }, 300),
        [data]
    );

    const setChatSelectedUser = (conversationId: string) => {
        if (conversationId.trim().length === 0) return;
        const conversationFind = data.find(e => e.converdationId === conversationId);
        if (!conversationFind) return;
        setCurrentConversationId(conversationFind.converdationId);
        setCurrentMessages(conversationFind.messages);
        onClose();
        onCloseSidebar();
    }

    const handleKeyUpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchChat(value);
        handleSearch(value);
    };

    return (
        <>
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
                onClick={onOpen}
            >
                Buscar chat
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <Search />
                            <Heading fontSize={"xl"}>Buscar chat</Heading>
                        </HStack>
                        <ModalCloseButton
                            _hover={{
                                borderColor: "transparent",
                                bg: "gray.100"
                            }}
                            _focus={{
                                outline: "none"
                            }}
                        />
                        <Input
                            mt={8}
                            value={valueSearchChat}
                            onChange={handleKeyUpInput}
                            _focus={{
                                boxShadow: "none",
                                borderColor: "gray.300"
                            }}
                            placeholder="Busca por el nombre del chat"
                            autoFocus
                        />
                        <Box mt={5}>
                            <Heading fontSize={"sm"}>Tus chats ({dataFilter.length})</Heading>
                        </Box>
                    </ModalHeader>
                    <ModalBody maxHeight={200} overflowY={"auto"}>
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
                                        icon={<MessageCircleMore size={15} />}
                                        onClick={() => setChatSelectedUser(item.converdationId)}
                                    >
                                        {item.title}
                                    </MenuItem>
                                ))
                            ) : (
                                dataFilter.length === 0 ?
                                    (
                                        <Text
                                            minHeight={100}
                                            display={"grid"}
                                            placeContent={"center"}
                                        >
                                            Sin resultados
                                        </Text>
                                    ) : (
                                        <Center>
                                            <Text>{valueSearchChat}</Text>
                                            <AnimatedLoader />
                                        </Center>
                                    )
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Heading fontSize={"lg"}>
                            chatAPA
                        </Heading>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}