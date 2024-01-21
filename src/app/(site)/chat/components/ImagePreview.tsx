import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type ImagePreviewProps = {
    src: string
    galleryID?: string
}

const getImageDimensions = (src: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
};

export default function ImagePreview({ src, galleryID = 'galleryID' }: ImagePreviewProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: `#${galleryID}`,
            children: 'a',
            showHideAnimationType: 'fade',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
        };
    }, []);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const dimensions: any = await getImageDimensions(src);
                setDimensions(dimensions);
            } catch (error) {
                console.error("Error loading image:", error);
            }
        };

        loadImage();
    }, [src]);

    return (
        <a
            key={galleryID + '-' + src}
            href={src}
            data-pswp-width={dimensions.width}
            data-pswp-height={dimensions.height}
            target="_blank"
            rel="noreferrer"
        >
            <NextImage alt='upload-image' src={src} width={dimensions.width} height={dimensions.height} />
        </a>
    );
}
