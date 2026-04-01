import { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import PlantList from "./plant-list";
import { type Plant } from "../../types/plant";
import api from "../../client/client"
import { Typography, Box } from "@mui/material";

const PublicPlantsPage = () => {
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        const fetchPublicPlants = async () => {
            try {
                const plants = await api.get("/plants/public")
                setPlants(plants.data)

            } catch (err: any) {
                console.log(err)
            }
        }
        fetchPublicPlants()
    }, []);
    

    return (
        <Box
            sx={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                overflow: 'hidden',
                backgroundColor: '#f9fafb'
            }}
        >
            <Navbar />
            <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', paddingY: 4}}>
                Community Plants
            </Typography>
            <Box sx={{flex: 1, minHeight: 0, display: 'flex', pb: 5, width: '80%', mx: 'auto'}}>
                <PlantList plants={plants} multipleSelect={false}/>
            </Box>
        </Box>
    )
}

export default PublicPlantsPage;