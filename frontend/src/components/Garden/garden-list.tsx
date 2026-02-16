import { Box, Grid, List, ListItem, ListItemButton, Typography } from "@mui/material"
import type { Garden } from "../../types/garden"
import placeholderImage from "../../assets/image_placeholder.svg"
import TagBubble from "./tag";

type GardenListProps = {
  gardens: Garden[];
};

const GardenList = ({gardens}: GardenListProps) => {
    return (
        <List sx={{width: "60%", mx: "auto"}}>
            {gardens.map((garden) => {
                return (
                    <ListItem key={garden.id} disablePadding sx={{mb: 1}} >
                        <ListItemButton
                            sx={{
                                width: "100%",
                                border: '1px solid',
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 2
                            }}
                        >
                            <Grid container spacing={2} sx={{width: "100%"}}>
                                <Grid size={3}>
                                    <Box
                                        component="img"
                                        src={placeholderImage}
                                        sx={{
                                            height: 160, 
                                            width: "100%", 
                                            display: "block",
                                            objectFit: "cover",
                                            borderRadius: 2
                                        }}
                                    />
                                </Grid>

                                <Grid size={9}>
                                    <Typography variant="h6" fontWeight={600} sx={{pl: 1}}>
                                        {garden.name}
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" sx={{pl: 1}}>
                                        Created By: test - New Zealand
                                    </Typography>

                                    <Typography variant="body2" sx={{pt:2, color: "text.primary", lineHeight: 1.4, pl: 1}}>
                                        {garden.description}
                                    </Typography>
                                    
                                    {garden.tags[0] && (

                                        <List sx={{display: 'flex', flexDirection: 'row', pl: 0.5, pt: 3.5, pb: 0}}>
                                            {garden.tags.map((tag) => {
                                                return (
                                                    <ListItem key={tag.id} sx={{width: "auto", padding: "3px"}}>
                                                        <TagBubble tag={tag}/>
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    )}
                                    
                                    
                                </Grid>
                            </Grid>
                            

                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default GardenList