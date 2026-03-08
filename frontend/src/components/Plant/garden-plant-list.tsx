import type { GardenPlant } from "../../types/plant";
import { Grid, Typography } from "@mui/material";


type PlantListProps = {
  gardenPlants: GardenPlant[];
};


const GardenPlantList = ({gardenPlants}: PlantListProps) => {


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
                }}
            >
                {gardenPlants.map((plant) => (
                    <Grid size={{md: 12, lg: 6, xl: 4}} key={plant.id}>
                        <Typography variant="h5" fontWeight={600}>
                            {plant.plant.common_name}
                        </Typography>
                        <Typography>
                            {plant.planted_date ? plant.planted_date : "No Planted Date Set"}
                        </Typography>
                        <Typography>
                            {plant.notes ? plant.notes : "No Plant notes Set"}
                        </Typography>
                    </Grid>

                ))}


            </Grid>

        </Grid>
    )
}

export default GardenPlantList;