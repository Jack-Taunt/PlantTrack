import Navbar from "../common/Navbar";
import { Typography, Box } from "@mui/material";
import GardenList from "./garden-list";
import { useEffect, useState } from "react";
import api from "../../client/client"
import type { Garden, GardenImage } from '../../types/garden';


const PublicGardensPage = () => {
    const [gardens, setGardens] = useState<Garden[]>([]);
    const [gardenImages, setGardenImages] = useState<GardenImage[]>([]);

    useEffect(() => {
        const fetchPublicGardens = async () => {
            try {
                const gardens = await api.get("/gardens/public")
                setGardens(gardens.data)

                gardens.data.forEach((garden: Garden) => {
                    if (garden.garden_images.length > 0) {
                        fetchGardenImage(garden.id, garden.garden_images[0].id)
                    }
                })

            } catch (err: any) {
                console.log(err)
            }
        }
        fetchPublicGardens()
    }, []);

    
    const fetchGardenImage = async (gardenId: number, imageId: number) => {
        try {
            const image = await api.get(`/gardens/${gardenId}/image/${imageId}`,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(image.data);
            

            setGardenImages(prev => {
                if (prev.find(img => img.id === gardenId)) return prev;
                return [...prev, {id: gardenId, image: url}]
            });
            
        } catch (err: any) {
            console.log(err.response)
        }
    }


    return (
        <>
            <Navbar />
            <Box sx={{backgroundColor: '#f9fafb'}}>
                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', paddingY: 4}}>
                    Community Gardens
                </Typography>
                <GardenList gardens={gardens} gardenImages={gardenImages}/>
            </Box>
        </>
    )
}

export default PublicGardensPage;