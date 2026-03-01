import { Grid, Box, ListItemButton, Typography } from "@mui/material";
import { type Plant } from "../../types/plant";
import { useState } from "react";
import placeholderImage from "../../assets/image_placeholder.svg"

type PlantListProps = {
  plants: Plant[];
  plantsSelected?: (plants: number[]) => void;
  multipleSelect: boolean;
};

const PlantList = ({plants, plantsSelected, multipleSelect}: PlantListProps) => {
    const [selectedPlants, setSelectedPlants] = useState<number[]>([]);

    const handleClick = (plantId: number) => {

        const foundPlantIndex = selectedPlants.indexOf(plantId)
        if (foundPlantIndex > -1) {
            const updatedPlants = selectedPlants.filter(id => id !== plantId)
            setSelectedPlants(updatedPlants)
            if (plantsSelected) {
                plantsSelected(updatedPlants)
            }

        } else {
            const updatedPlants = (multipleSelect == true) ? [...selectedPlants, plantId] : [plantId]
            setSelectedPlants(updatedPlants)
            if (plantsSelected) {
                plantsSelected(updatedPlants)
            }
        }  
          
    };

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
                                borderColor: selectedPlants.indexOf(plant.id) > -1 ? "black" : "divider",
                                borderRadius: 2,
                                p: 1,
                                backgroundColor: selectedPlants.indexOf(plant.id) > -1 ? '#f5f5f5' : 'white'
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
                            
                        </ListItemButton>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default PlantList;
