import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import type { Garden } from "../../types/garden"

type GardenListProps = {
  gardens: Garden[];
};

const GardenList = ({gardens}: GardenListProps) => {
    return (
        <List>
            {gardens.map((garden) => {
                return (
                    <ListItem
                        key={garden.id}
                    >
                        <ListItemButton>
                            <ListItemText primary={`${garden.name} --- ${garden.description} --- ${garden.is_public}`}/>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default GardenList