import { Box, Grid, List, ListItem, ListItemButton, Typography, Stack, Button } from "@mui/material"
import type { Garden, gardenImage } from "../../types/garden"
import placeholderImage from "../../assets/image_placeholder.svg"
import TagList from "./tag-list";
import { ArrowForwardIos, ArrowBackIos, LocationOn, PersonRounded } from "@mui/icons-material";
import { useState } from "react";
import DeleteGardenButton from "./delete-garden-button";
import { Link } from "react-router-dom";

type GardenListProps = {
  gardens: Garden[];
  gardenImages: gardenImage[];
  onGardenDeleted?: () => void;
};

const GardenList = ({gardens, gardenImages, onGardenDeleted}: GardenListProps) => {
    const [selectedGarden, setExpandedGarden] = useState<Garden | null>(null);

    const handleClick = (gardenId: number) => {
        if (selectedGarden?.id === gardenId) {
            setExpandedGarden(null)
        } else {
            const foundGarden = gardens.find((garden) => garden.id === gardenId)
            if (foundGarden) {
                setExpandedGarden(foundGarden)
            }
            
        }
        
    };

    const handleDeleteGarden = () => {
        onGardenDeleted && onGardenDeleted();
        setExpandedGarden(null);
    }


    return (
        <Grid container spacing={2} sx={{minHeight: "100vh"}}>
            <Grid size={2}/>
            <Grid size={5}>
                <List sx={{width: "100%", mx: "auto", padding: 0}}>
                    {gardens.map((garden) => {
                        return (
                            <ListItem key={garden.id} disablePadding sx={{mb: 1}} >
                                <ListItemButton
                                    sx={{
                                        width: "100%",
                                        border: '1px solid',
                                        borderColor: garden.id === selectedGarden?.id ? "black" : "divider",
                                        borderRadius: 2,
                                        p: 2,
                                        backgroundColor: garden.id === selectedGarden?.id ? '#f5f5f5' : 'white'
                                    }}
                                    onClick={() => handleClick(garden.id)}
                                >
                                    <Grid container spacing={2} sx={{width: "100%"}}>
                                        <Grid size={3}>
                                            <Box
                                                component="img"
                                                src={gardenImages.find(gardenImage => gardenImage.gardenId === garden.id)?.image || placeholderImage}
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
                                                Created By: {garden.user.username} - New Zealand
                                            </Typography>

                                            <Typography variant="body2" sx={{pt:2, color: "text.primary", lineHeight: 1.4, pl: 1}}>
                                                {garden.description}
                                            </Typography>
                                            
                                            {garden.tags[0] && (
                                                <TagList tags={garden.tags}/>
                                            )}
                                            
                                            
                                        </Grid>
                                    </Grid>
                                    
                                    {selectedGarden?.id === garden.id ? <ArrowBackIos /> : <ArrowForwardIos />}
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Grid>
            <Grid size={3}>
                {selectedGarden && (
                    <Box
                        sx={{
                            border: "1px solid",
                            borderColor: "black",
                            borderRadius: 2,
                            position: "sticky",
                            top: 180,
                            height: "80vh",
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                overflowY: "auto",
                                flexGrow: 1,
                                p: 2
                            }}
                        >
                            <Stack>
                                <Box
                                    component="img"
                                    src={gardenImages.find(gardenImage => gardenImage.gardenId === selectedGarden.id)?.image || placeholderImage}
                                    sx={{
                                        height: 320, 
                                        width: "100%", 
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: 2
                                    }}
                                />
                                <Typography variant="h4" sx={{fontWeight: 600, p: 3}}>{selectedGarden.name}</Typography>
                                <Stack direction="row" sx={{pl: 3}}>
                                    <PersonRounded/>
                                    <Typography variant="body1" color="text.secondary" sx={{fontWeight: 600, pl: 1}}>Created By:  {selectedGarden.user.username}</Typography>
                                </Stack>
                                <Stack direction="row" sx={{pl: 3}}>
                                    <LocationOn/>
                                    <Typography variant="body1" color="text.secondary" sx={{fontWeight: 600, pl: 1}}>Located In:  LOCATION</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{pl: 3, pt: 3}}>{selectedGarden.description}</Typography>
                                {selectedGarden.tags[0] && (
                                    <TagList tags={selectedGarden.tags}/>
                                )}
                                <Box sx={{height: 800}}>
                                </Box>
                                
                            </Stack>
                        </Box>
                        <Stack
                            direction="row"
                            sx={{width: "100%", pt: 2, pb: 3}}
                            justifyContent='center'
                        > 
                            <Button 
                                variant="contained" 
                                sx={{width: '100%', ml: 3, mr: 3}}
                                component={Link}
                                to={`/gardens/${selectedGarden.id}`}
                            >
                                Visit Garden
                            </Button>
                            {onGardenDeleted &&
                                <DeleteGardenButton garden={selectedGarden} onGardenDeleted={handleDeleteGarden}/>
                            }   
                        </Stack>
                        
                    </Box>
                )}
            </Grid>
            <Grid size={2}/>
        </Grid>
    )
}

export default GardenList