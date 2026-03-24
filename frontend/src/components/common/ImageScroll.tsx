import { Box, Fab } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import placeholderImage from "../../assets/image_placeholder.svg"


type imageScrollProps = {
    imageSrc: string | null;
    handleImageUpload: (event: any) => void;
    canEdit: boolean;
}

const ImageScroll = ({imageSrc, handleImageUpload, canEdit}: imageScrollProps) => {
    return (
        <>
            <Box
                component="img"
                src={imageSrc || placeholderImage}
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
        </>
    )
}

export default ImageScroll;