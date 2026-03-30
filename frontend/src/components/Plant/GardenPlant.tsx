import { Typography, Box } from "@mui/material"
import { useEffect, useState } from "react";
import type { GardenPlant, Plant } from "../../types/plant";
import api from "../../client/client"

type GardenPlantProps = {
    gardenId?: number;
    plantId?: number;
}

const GardenPlantInfo = ({gardenId, plantId}: GardenPlantProps) => {

    const [gardenPlant, setGardenPlant] = useState<GardenPlant>();


    const fetchPlant = async (plantId: number) => {
        try {
            const plant = await api.get(`/gardens/${gardenId}/plant/${plantId}`)
            setGardenPlant(plant.data)
            
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!plantId) return;
        fetchPlant(plantId);
    }, [plantId])


    return (
        <>
            {gardenPlant && (
                <Box sx={{p:5}}>
                    <Box sx={{border: '1px solid', borderRadius: 2, height: 320}}>
                        <Typography>
                            {gardenPlant.plant.common_name}
                        </Typography>
                    </Box>
                </Box>
            )}
        </>
            
    )
}

export default GardenPlantInfo;