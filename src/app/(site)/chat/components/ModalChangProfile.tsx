import React, { useEffect, useState, useTransition } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Input } from "@nextui-org/react";
import toast from "react-hot-toast";

import { fileToBase64 } from "@/libs/helper";
import { getCurrentUser, updateUser } from "@/app/actions/UserAction";
import { useModalChangeProfile } from "@/stores/store";

export default function ModalChangProfile() {
    const { show, toggle } = useModalChangeProfile();

    const [oldImage, setOldImage] = useState('');
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    let [isPending, startTransition] = useTransition();

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            let data = {
                name: newName,
                image: oldImage,
            }
            if (file) {
                formData.append('file', file!);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

                await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                    {
                        method: 'POST',
                        body: formData
                    })
                    .then((response: Response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((res: any) => {
                        data.image = res?.secure_url
                    })
                    .catch((error) => {
                        console.error('Fetch error:', error.message);
                    });
            }

            const flag = await updateUser(data)

            if (flag) {
                toast.success('Success update!');
                toggle();
            }
        })
    }

    useEffect(() => {
        startTransition(async () => {
            const res = await getCurrentUser();
            if (res) {
                setNewName(res.name!);
                setOldImage(res.image!);
            }
        });
    }, [])

    useEffect(() => {
        const getImageSrc = async () => {
            setImgSrc((file ? await fileToBase64(file) : oldImage) as string);
        }

        getImageSrc();
    }, [file, oldImage])

    return (
        <Modal isOpen={show} onOpenChange={toggle}>
            <ModalContent>
                <form action={handleSubmit}>
                    <ModalHeader>Profile</ModalHeader>
                    <ModalBody className="mx-auto items-center w-full gap-y-10">
                        <div className="group relative">
                            <Avatar src={imgSrc || '/images/user-placeholder.png'} className="w-40 h-40 text-large" />

                            {
                                !isPending &&
                                <>
                                    <div className="bg-slate-500 text-white opacity-80 hidden group-hover:flex cursor-pointer font-medium h-full w-full absolute top-0 justify-center items-center rounded-full" onClick={() => document.getElementById('fileInput')?.click()}>Change Profile</div>
                                    <input style={{ display: 'none' }} id='fileInput' type="file" name="file" accept="jpg, jpeg, png" onChange={handleFileChange} />
                                </>
                            }
                        </div>

                        <Input disabled={isPending} name="name" type="text" label="Name" value={newName} onInput={(e: any) => setNewName(e.target.value)} />
                    </ModalBody>
                    <ModalFooter>
                        <Button isLoading={isPending} color="danger" variant="light" onClick={toggle}>
                            Close
                        </Button>
                        <Button isLoading={isPending} type="submit" color="primary">
                            Update
                        </Button>
                    </ModalFooter>
                </form>

            </ModalContent>
        </Modal>
    );
}

