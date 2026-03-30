import { Typography, Box, Paper } from "@mui/material"
import { useEffect, useState } from "react";
import type { GardenPlant } from "../../types/plant";
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
                <Box sx={{px:5, pt: 3 }}>
                    <Paper elevation={2} sx={{borderRadius: 2, height: 320}}>
                        <Typography>
                            {gardenPlant.plant.common_name}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </>
            
    )
}

export default GardenPlantInfo;