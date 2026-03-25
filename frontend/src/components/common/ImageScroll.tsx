import { Box, Fab } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import placeholderImage from "../../assets/image_placeholder.svg"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import type { GardenImage } from "../../types/garden";

type imageScrollProps = {
    images: GardenImage[];
    handleImageUpload: (event: any) => void;
    canEdit: boolean;
}

const ImageScroll = ({images, handleImageUpload, canEdit}: imageScrollProps) => {
    const [imageIndex, setImageIndex] = useState<number>(0);
    
    useEffect(() => {
        if (images.length > 0) {
            setImageIndex(0)
        }
    }, [images])

    const handleImageScrollIncrease = () => {
        if (imageIndex < images.length-1) { 
            setImageIndex(imageIndex + 1)
        }
    };

    const handleImageScrollDecrease = () => {
        if (imageIndex > 0) { 
            setImageIndex(imageIndex -1)
        }
    };

    return (
        <>
            <Box
                component="img"
                src={images[imageIndex]?.image ?? placeholderImage}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    p: 4
                }}
            />
            {canEdit &&
                <Box
                    sx={{position: 'absolute', top: '10%', right: '8%'}}
                >
                    <input
                        accept="image/jpeg,image/png,image/webp"
                        type="file"
                        onChange={(event) => {handleImageUpload(event)}}
                        id="contained-button-file"
                        style={{display: 'none'}}
                    />
                    <label htmlFor="contained-button-file">
                        <Fab component="span">
                            <AddPhotoAlternateIcon style={{ fontSize: "45px" }} />
                        </Fab>
                    </label>
                </Box>
            }
            {images.length > 0 &&
                <>
                    <Box
                        sx={{position: 'absolute', top: '47%', left: '5%'}}
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
                        sx={{position: 'absolute', top: '47%', right: '5%'}}
                    >
                        <Fab 
                            component="span" 
                            size="small"
                            onClick={handleImageScrollIncrease}
                            disabled={imageIndex >= images.length-1}
                        >
                            <ArrowForwardIosIcon style={{ fontSize: "35px" }} />
                        </Fab>
                    </Box>
                </>
            }  
        </>
    )
}

export default ImageScroll;