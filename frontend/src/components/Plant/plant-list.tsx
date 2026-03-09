import { Grid, Box, ListItemButton, Typography, Button } from "@mui/material";
import { type Plant } from "../../types/plant";
import { useEffect, useState } from "react";
import placeholderImage from "../../assets/image_placeholder.svg"
import IncrementDecrementButtons from "../common/incrementDecrementButtons";
import {type GardenPlantAmount} from "../../types/garden";

type PlantListProps = {
  plants: Plant[];
  plantsSelected?: (plants: GardenPlantAmount[]) => void;
  multipleSelect: boolean;
};

const PlantList = ({plants, plantsSelected, multipleSelect}: PlantListProps) => {
    const [selectedPlants, setSelectedPlants] = useState<GardenPlantAmount[]>([]);

    const setPlantAmount = (plantId: number, amount: number | null) => {

        const foundPlantIndex = selectedPlants.map((plant) => plant.plant_id).indexOf(plantId)
        if (!amount) {
            if (foundPlantIndex > -1) {
                amount = 0
            } else {
                amount = 1
            }
        }

        if (foundPlantIndex > -1) {

            if (amount === 0) {
                const updatedPlants = selectedPlants.filter(plant => plant.plant_id !== plantId)
                setSelectedPlants(updatedPlants)
                if (plantsSelected) {
                    plantsSelected(updatedPlants)
                }

            } else {
                const updatedPlants = selectedPlants.map(plant => plant.plant_id === plantId ? {...plant, amount: amount} : plant);
                setSelectedPlants(updatedPlants)
                if (plantsSelected) {
                    plantsSelected(updatedPlants)
                }
            }

        } else {
            const updatedPlants = (multipleSelect == true) ? [...selectedPlants, {plant_id: plantId, amount: 1}] : [{plant_id: plantId, amount: 1}]
            setSelectedPlants(updatedPlants)
            if (plantsSelected) {
                plantsSelected(updatedPlants)
            }
        }
    }

    const handleClick = (plantId: number) => {
        setPlantAmount(plantId, null);
    };

    const setPlantAmountCallback = (id: number, value: number) => {
        setPlantAmount(id, value)
    }
    

    return (
        <Grid container spacing={1} sx={{height: '100%'}}>
            <Grid 
                container 
                spacing={2} 
                sx={{
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: 'black', 
                    height: "100%",
                    width: "100%", 
                    overflowY: "auto", 
                    margin: '0 auto', 
                    scrollbarGutter: 'auto'
                }}>
                {plants.map((plant) => (
                    <Grid size={{md: 12, lg: 6, xl: 4}} key={plant.id}>
                        <ListItemButton 
                            sx={{
                                width: "100%",
                                height: "100%",
                                border: '1px solid',
                                borderColor: selectedPlants.map((plant) => plant.plant_id).indexOf(plant.id) > -1 ? "black" : "divider",
                                borderRadius: 2,
                                p: 1,
                                backgroundColor: selectedPlants.map((plant) => plant.plant_id).indexOf(plant.id) > -1 ? '#f5f5f5' : 'white'
                            }}
                            onClick={() => handleClick(plant.id)}
                        >
                            <Grid size={4}>
                                <Box
                                    component="img"
                                    src={placeholderImage}
                                    sx={{
                                        maxHeight: "100%",
                                        maxWidth: "100%", 
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: 2
                                    }}
                                />
                            </Grid>
                            <Grid size={8}>
                                <Box>
                                    {plant.common_name && plant.common_name.toLowerCase() !== plant.scientific_name.toLowerCase() ? (
                                        <>
                                            <Typography variant="h5" fontWeight={600} sx={{pl: 0}} align="center">
                                                {plant.common_name}
                                            </Typography>
                                            <Typography variant="h6" sx={{pl: 0}} align="center">
                                                ({plant.scientific_name})
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="h5" fontWeight={600} sx={{pl: 0}} align="center">
                                                {plant.scientific_name}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                            {selectedPlants.map((plant) => plant.plant_id).indexOf(plant.id) > -1 &&
                                <Box sx={{position: 'absolute', right: '2%', top: '2%', width: 120, height: 35}}>
                                    <IncrementDecrementButtons setValueCallback={(value) => setPlantAmountCallback(plant.id, value)}/>
                                </Box>
                            }
                            
                        </ListItemButton>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default PlantList;
