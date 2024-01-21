import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type ImagePreviewProps = {
    src: string
    galleryID?: string
}

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
        const image = new Image();

        image.onload = () => {
            setDimensions({
                width: image.width,
                height: image.height,
            });
        };

        image.src = src;

        return () => {
            image.onload = null;
        };
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
