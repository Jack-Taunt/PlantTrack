import type { GardenPlant } from "../../types/plant";
import { Grid, ListItemButton, Stack, Typography } from "@mui/material";
import { useState } from "react";

type PlantListProps = {
  gardenPlants: GardenPlant[];
  setGardenPlantSelected: (plantId: number) => void;
};


const GardenPlantList = ({gardenPlants, setGardenPlantSelected}: PlantListProps) => {

    const [selectedPlant, setSelectedPlant] = useState<number|null>(null);

    const handleSetSelectedPlant = (plantId: number) => {
        setSelectedPlant(plantId);
        setGardenPlantSelected(plantId);
    }

    return (
        <Grid container spacing={1} sx={{height: '100%', py:2}}>
            <Grid 
                container 
                spacing={2} 
                sx={{
                    p: 2, 
                    borderRadius: 2, 
                    height: 355,
                    width: "100%", 
                    overflowY: "auto", 
                    margin: '0 auto', 
                    scrollbarGutter: 'auto'
                }}
            >
                {gardenPlants.map((gardenPlant) => (
                    <Grid size={{xs: 12, md: 6, xl: 4}} key={gardenPlant.id}>
                        <ListItemButton
                            sx={{
                                width: "100%",
                                height: "100%",
                                border: gardenPlant.id === selectedPlant ? '1px solid black' : '1px solid lightgray',
                                borderRadius: 2,
                                p: 1,
                                backgroundColor: gardenPlant.id === selectedPlant ? '#f5f5f5' : 'white'
                                
                            }}
                            onClick={() => handleSetSelectedPlant(gardenPlant.id)}
                        >
                            <Stack>
                                {gardenPlant.plant.common_name && gardenPlant.plant.common_name.toLowerCase() !== gardenPlant.plant.scientific_name.toLowerCase() ? (
                                    <Typography variant="h5" fontWeight={600}>
                                        {gardenPlant.plant.common_name}{' '}
                                        {gardenPlant.plant.variety && (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: '0.8em', fontWeight: 400, fontStyle: 'italic' }}
                                            >
                                                ({gardenPlant.plant.variety})
                                            </Typography>
                                        )}
                                    </Typography>
                                ) : (
                                    <Typography variant="h5" fontWeight={600}>
                                        {gardenPlant.plant.scientific_name}{' '}
                                        {gardenPlant.plant.variety && (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: '0.8em', fontWeight: 400, fontStyle: 'italic' }}
                                            >
                                                ({gardenPlant.plant.variety})
                                            </Typography>
                                        )}
                                    </Typography>
                                )}
                                <Typography>
                                    {gardenPlant.planted_date ? gardenPlant.planted_date : "No Planted Date Set"}
                                </Typography>
                                <Typography>
                                    {gardenPlant.notes ? gardenPlant.notes : "No Plant notes Set"}
                                </Typography>
                            </Stack>
                        </ListItemButton>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default GardenPlantList;