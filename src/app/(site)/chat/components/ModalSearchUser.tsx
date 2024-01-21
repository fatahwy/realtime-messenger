'use client'

import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { RiChatNewLine } from "react-icons/ri";
import { useAsyncList } from "@react-stately/data";
import { useRouter } from "next/navigation";
import { getUsers } from "@/app/actions/UserAction";

export default function ModalSearchUser() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [validate, setValidate] = useState(false);
    const router = useRouter();

    let list = useAsyncList({
        async load({ signal, filterText }) {
            let items = await getUsers(filterText)

            return { items };
        },
    });

    useEffect(() => {
        setValidate(false)
    }, [isOpen])

    const selectedValue: any = useMemo(() => list.items.find((d: any) => d.name === list.filterText), [list.items, list.filterText])

    const handleStartChat = (onClose: () => void) => {
        setValidate(true);

        if (selectedValue) {
            router.push(`/chat/${selectedValue.id}`);
            onClose();
        }
    }

    return (
        <>
            <button onClick={onOpen} title="New Conversation">
                <RiChatNewLine className="text-lg" />
            </button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Search People</ModalHeader>
                            <ModalBody>
                                <Autocomplete
                                    className="w-full"
                                    inputValue={list.filterText}
                                    isLoading={list.isLoading}
                                    items={list.items}
                                    placeholder="Type to search..."
                                    variant="bordered"
                                    isInvalid={validate && !selectedValue}
                                    errorMessage={validate && !selectedValue && "Select first"}
                                    aria-label="search-people"
                                    onInputChange={list.setFilterText}
                                >
                                    {(item: any) => (
                                        <AutocompleteItem key={item.name} className="capitalize">
                                            {item.name}
                                        </AutocompleteItem>
                                    )}
                                </Autocomplete>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={() => handleStartChat(onClose)}>
                                    Start Chat
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
