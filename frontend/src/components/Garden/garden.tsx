import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useState, useEffect } from "react";
import { type Garden } from "../../types/garden";
import api from "../../client/client"
import { Box, Button, Typography, Modal, Stack } from "@mui/material";
import TagList from "./tag-list";
import { useAuth } from "../common/AuthProvider";
import PlantList from "../Plant/plant-list";
import { type Plant } from "../../types/plant";


const GardenPage = () => {
    const gardenId = useParams().gardenId;
    const [garden, setGarden] = useState<Garden | null>(null);

    const { user } = useAuth();

    const [addPlantModalOpen, setAddPlantModalOpen] = useState(false);
    const handleAddPlantModalOpen = () => setAddPlantModalOpen(true);
    const handleAddPlantModalClose = () => setAddPlantModalOpen(false);

    const fetchGarden = async () => {
        try {
            const garden = await api.get("/gardens/" + gardenId)
            setGarden(garden.data)
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchGarden()
    }, []);

    const [publicPlants, setPublicPlants] = useState<Plant[]>([]);
    const [hasLoadedPlants, setHasLoadedPlants] = useState(false);


    const [selectedPlants, setSelectedPlants] = useState<number[]>([]);
    const plantsSelected = async (plants: number[]) => {
        setSelectedPlants(plants)
    }


    useEffect(() => {
        const fetchPublicPlants = async () => {
            if (addPlantModalOpen && !hasLoadedPlants) {
                try {
                    const publicPlants = await api.get("/plants/public")
                    setPublicPlants(publicPlants.data)
                    setHasLoadedPlants(true);

                } catch (err: any) {
                    console.log(err)
                }
            }
            
        }

        fetchPublicPlants()
    }, [addPlantModalOpen, hasLoadedPlants])


    const addGardenPlants = async () => {
        try {
            await api.post(`/gardens/${gardenId}/plants`,
                selectedPlants
            )
            handleAddPlantModalClose()
        } catch (err: any) {
            console.log(err)
        }
    }


    return (
        
        <>
            <Navbar/>
            {garden && (
                <div>
                    <Typography variant="h3" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                        {garden.name}
                    </Typography>
                    <Typography variant="h5" sx={{textAlign: 'center', pt: 4}}>
                        {garden.description}
                    </Typography>
                    <Box sx={{display: "flex", mx: 'auto', justifyContent: 'center'}}>
                        {garden.tags &&
                            <TagList tags={garden.tags}/>
                        }
                    </Box>
                    {user?.id === garden.user_id && (
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={handleAddPlantModalOpen}
                        >
                            Add New Plant
                        </Button>
                    )}
                    <Modal
                        open={addPlantModalOpen}
                        onClose={handleAddPlantModalClose}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "60%",
                                height: "80%",
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <Stack
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                                gap={1}
                            >
                                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center'}}>
                                    Add a new Plant
                                </Typography>
                                <Stack 
                                    direction="row"
                                    sx={{width: "100%", gap: 1}}
                                    justifyContent='center'
                                >
                                    <Typography sx={{alignContent: 'center'}}>
                                        Choose a plant from our plant database
                                    </Typography>
                                    <Button sx={{p: 0, textTransform: 'capitalize'}}>
                                        or Create a custom plant
                                    </Button>
                                </Stack>
                                <Box 
                                    sx={{
                                        minHeight: 0, mt: 2
                                    }}
                                >
                                    <PlantList plants={publicPlants} plantsSelected={plantsSelected} multipleSelect={true} />
                                </Box>
                                <Stack
                                    direction="row"
                                    sx={{
                                        width: "100%", 
                                        gap: 5, 
                                        p: 2, 
                                        borderRadius: 2, 
                                        border: '1px solid', 
                                        borderColor: 'black', 
                                    }}
                                    justifyContent='center'
                                >
                                    {selectedPlants.length > 0 &&
                                        <Typography
                                            sx={{alignContent: 'center', fontWeight: 600}}
                                            variant="body1"
                                        >
                                            Currently Selected Plants: {selectedPlants.map(id => publicPlants.find(p => p.id === id)?.common_name).join(', ')}
                                        </Typography>
                                    }
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        disabled={selectedPlants.length === 0}
                                        sx={{height: 50, width: 150}}
                                        onClick={() => addGardenPlants()}
                                    >
                                        Add Plants
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Modal>
                </div>
            )}
        </>
    )
};

export default GardenPage;