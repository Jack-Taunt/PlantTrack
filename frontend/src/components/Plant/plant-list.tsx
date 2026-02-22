import { List, ListItem, Typography } from "@mui/material";
import { type Plant } from "../../types/plant";


type PlantListProps = {
  plants: Plant[];
};

const PlantList = ({plants}: PlantListProps) => {
    console.log(plants)
    return (
        <List>
            {plants.map((plant) => {
                return (
                    <ListItem sx={{border: "1px solid"}}>
                        <Typography>
                            {plant.common_name}
                        </Typography>
                    </ListItem>
                )
            })}

        </List>
    )
}

export default PlantList;
