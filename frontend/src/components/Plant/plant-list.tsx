import { Grid, Box, ListItemButton, Typography } from "@mui/material";
import { type Plant } from "../../types/plant";
import { useState } from "react";
import placeholderImage from "../../assets/image_placeholder.svg"

type PlantListProps = {
  plants: Plant[];
};

const PlantList = ({plants}: PlantListProps) => {
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    const handleClick = (plantId: number) => {
        if (selectedPlant?.id === plantId) {
            setSelectedPlant(null)
        } else {
            const foundPlant = plants.find((plant) => plant.id === plantId)
            if (foundPlant) {
                setSelectedPlant(foundPlant)
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
                                height: 160,
                                border: '1px solid',
                                borderColor: plant.id === selectedPlant?.id ? "black" : "divider",
                                borderRadius: 2,
                                p: 1,
                                backgroundColor: plant.id === selectedPlant?.id ? '#f5f5f5' : 'white'
                            }}
                            onClick={() => handleClick(plant.id)}
                        >
                            <Grid size={4}>
                                <Box
                                    component="img"
                                    src={placeholderImage}
                                    sx={{
                                        maxWidth: "95%", 
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: 2
                                    }}
                                />
                            </Grid>
                            <Grid size={8}>
                                <Typography variant="h6" fontWeight={600} sx={{pl: 0}}>
                                    {plant.common_name && plant.common_name.toLowerCase() !== plant.scientific_name.toLowerCase() ? 
                                        <>{plant.common_name} ({plant.scientific_name})</>
                                    : 
                                        plant.scientific_name
                                    }
                                </Typography>
                            </Grid>
                            
                        </ListItemButton>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default PlantList;
