import { Box, Fab } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import placeholderImage from "../../assets/image_placeholder.svg"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useId, useState } from "react";
import type { GardenImage } from "../../types/garden";
import useEmblaCarousel from 'embla-carousel-react'
import ConfirmDeleteModal from "../common/confirmDeleteModal";

type imageScrollProps = {
    images: GardenImage[];
    handleImageUpload: (event: any) => void;
    canEdit: boolean;
    handleImageDelete: (imageId: number) => void;
}

const ImageScroll = ({images, handleImageUpload, canEdit, handleImageDelete}: imageScrollProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: false});
    const [imageIndex, setImageIndex] = useState<number>(0);

    const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false);

    const handleDeleteImageModalOpen = () => setDeleteImageModalOpen(true);
    const handleDeleteImageModalClose = () => setDeleteImageModalOpen(false);

    const inputId = useId();

    const handleImageScrollIncrease = () => {
        if (emblaApi?.canScrollNext()) { 
            setImageIndex(imageIndex + 1);
            emblaApi?.scrollNext();
            
        }
    };

    const handleImageScrollDecrease = () => {
        if (emblaApi?.canScrollPrev()) { 
            setImageIndex(imageIndex -1);
            emblaApi?.scrollPrev();
        }
    };

    const onDotButtonClick = (index: number) => {
        if (emblaApi) {
            setImageIndex(index);
            emblaApi.scrollTo(index);
        }
    }

    useEffect(() => {
        const onSelect = () => {
            if (emblaApi?.selectedScrollSnap() !== undefined) {
                setImageIndex(emblaApi?.selectedScrollSnap())
            }
        }
        emblaApi?.on('select', onSelect)
    }, [emblaApi])

    return (
        <div style={{height: "100%"}} className="outsideDiv">
            {images.length > 0 ? (
                <div style={{height: "100%"}}>
                    <div ref={emblaRef} style={{overflow: 'hidden', height: '100%'}}>
                        <div style={{display: 'flex', height: "100%"}}>
                            {images.map(image => (
                                <div 
                                    key={image.id} 
                                    style={{
                                        flex: '0 0 100%', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={image.image ?? placeholderImage}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                            p: 4
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <Box
                    component="img"
                    src={placeholderImage}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        p: 4
                    }}
                />
            )}

            {canEdit &&
                <Box
                    sx={{
                        position: 'absolute', 
                        top: '10%', 
                        right: '8%', 
                        opacity: 0, 
                        '.outsideDiv:hover &': {opacity: 1},
                        transition: 'opacity 0.5s ease'
                    }}
                >
                    <input
                        accept="image/jpeg,image/png,image/webp"
                        type="file"
                        onChange={(event) => {handleImageUpload(event)}}
                        id={inputId}
                        style={{display: 'none'}}
                    />
                    <label htmlFor={inputId}>
                        <Fab component="span">
                            <AddPhotoAlternateIcon style={{ fontSize: "45px" }} />
                        </Fab>
                    </label>
                </Box>
            }

            {canEdit && images.length > 0 &&
                <Box
                    sx={{
                        position: 'absolute', 
                        top: '10%', 
                        left: '8%', 
                        opacity: 0, 
                        '.outsideDiv:hover &': {opacity: 1},
                        transition: 'opacity 0.5s ease'
                    }}
                >
                    <Fab 
                        component="span" 
                        onClick={handleDeleteImageModalOpen}
                    >
                        <DeleteIcon style={{ fontSize: "45px" }} />
                    </Fab>
                </Box>
            }

            {images.length > 1 && (
                <>
                    <Box 
                        className="embla__dots" 
                        sx={{
                            position: 'absolute',
                            bottom: '3px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '8px',
                            padding: '6px 10px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        {images.map((_, index) => (
                            <button 
                                type="button"
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: index === imageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    transform: index === imageIndex ? 'scale(1.2)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            opacity: 0, 
                            '.outsideDiv:hover &': {opacity: 1},
                            transition: 'opacity 0.5s ease'
                        }}
                    >
                        <Box
                            sx={{position: 'absolute', top: '45.5%', left: '5%'}}
                        >
                            <Fab
                                component="span" 
                                size="small"
                                onClick={handleImageScrollDecrease}
                                disabled={imageIndex <= 0}
                            >
                                <ArrowBackIosNewIcon style={{ fontSize: "35px" }} />
                            </Fab>
                        </Box>
                        <Box
                            sx={{position: 'absolute', top: '45.5%', right: '5%'}}
                        >
                            <Fab 
                                component="span" 
                                size="small"
                                onClick={handleImageScrollIncrease}
                                disabled={images.length-1 <= imageIndex}
                            >
                                <ArrowForwardIosIcon style={{ fontSize: "35px" }} />
                            </Fab>
                        </Box>
                    </Box> 
                </>
            )}
            <ConfirmDeleteModal 
                modalOpen={deleteImageModalOpen} 
                handleModalClose={handleDeleteImageModalClose} 
                deleteFunction={() => {
                    handleImageDelete(images[imageIndex].id)
                    setImageIndex(imageIndex - 1)
                    handleDeleteImageModalClose();
                }} 
                title={"Are you sure you want to Delete this Image?"} 
                body={
                    <></>
                } 
                snackMessage="Image Successfully Deleted!"
            />
        </div>
    )
}

export default ImageScroll;