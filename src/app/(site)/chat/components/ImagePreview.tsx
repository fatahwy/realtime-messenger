import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Image } from "@nextui-org/react";

type ImagePreviewProps = {
    src:string
}

export default function ImagePreview({ src }: ImagePreviewProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Image className="hover:cursor-pointer" alt='Image' onClick={onOpen} src={src} width={120} />
            <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalBody className="items-center justify-center">
                        <Image alt="preview" src={src}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
