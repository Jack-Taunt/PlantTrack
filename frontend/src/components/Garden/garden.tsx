import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useState, useEffect, type SyntheticEvent } from "react";
import { type Garden } from "../../types/garden";
import api from "../../client/client"
import { Box, Button, Typography, Modal, Stack, Grid, Tab } from "@mui/material";
import TagList from "./tag-list";
import { useAuth } from "../common/AuthProvider";
import PlantList from "../Plant/plant-list";
import { type Plant, type GardenPlant } from "../../types/plant";
import GardenPlantList from "../Plant/garden-plant-list";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from 'dayjs';
import {type GardenPlantAmount} from "../../types/garden";
import placeholderImage from "../../assets/image_placeholder.svg"
import { TabContext, TabList, TabPanel } from '@mui/lab';

const GardenPage = () => {
    const gardenId = useParams().gardenId;
    const { user } = useAuth();

    const [garden, setGarden] = useState<Garden | null>(null);
    const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([])

    const [addPlantModalOpen, setAddPlantModalOpen] = useState(false);
    const handleAddPlantModalOpen = () => setAddPlantModalOpen(true);
    const handleAddPlantModalClose = () => {
        setAddPlantModalOpen(false);
        setPlantedDate(null);
        setSelectedPlants([]);
    }

    const [publicPlants, setPublicPlants] = useState<Plant[]>([]);
    const [hasLoadedPlants, setHasLoadedPlants] = useState(false);
    const [selectedPlants, setSelectedPlants] = useState<GardenPlantAmount[]>([]);
    const [plantedDate, setPlantedDate] = useState<Dayjs | null>(null);

    const currentYear = dayjs();

    const fetchGarden = async () => {
        try {
            const garden = await api.get(`/gardens/${gardenId}`)
            setGarden(garden.data)
            if (garden.data.sections.length > 0) {
                setGardenSectionTabSelected(garden.data.sections[0].id)
            }
            
        } catch (err: any) {
            console.log(err)
        }
    }


    const fetchGardenPlants = async () => {
        try {
            const gardenPlants = await api.get(`/gardens/${gardenId}/plants`)
            setGardenPlants(gardenPlants.data)
        } catch (err: any) {
            console.log(err)
        }
    }


    const plantsSelected = async (plants: GardenPlantAmount[]) => {
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
                {
                    plants: selectedPlants,
                    planted_date: plantedDate?.format("YYYY-MM-DD") ?? null,
                    section_id: gardenSectionTabSelected,
                }
            )
            handleAddPlantModalClose()
            fetchGardenPlants()
        } catch (err: any) {
            console.log(err)
        }
    }


    useEffect(() => {
        fetchGarden()
        fetchGardenPlants()
    }, []);


    const [gardenSectionTabSelected, setGardenSectionTabSelected] = useState<number | undefined>();

    const handleGardenSelectionTabChange = (_: SyntheticEvent, newSectionTabId: number) => {
        setGardenSectionTabSelected(newSectionTabId);
    }
    

    return (
        
        <>
            <Navbar/>
            {garden && (
                <div>
                    <Typography variant="h3" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                        {garden.name}
                    </Typography>
                    <Grid container sx={{height: 500, p: 5}}>
                        <Grid size={7} >
                            <Box sx={{border: '1px solid #000', borderRadius: 2, mr: 2, height: "100%"}}>
                                <Typography variant="h4" sx={{fontWeight: 'bold', pt: 2, mx: 3, borderBottom: '2px solid'}}>
                                    Garden Information:
                                </Typography>
                                <Typography variant="h5" sx={{pt: 4, mx: 3}}>
                                    {garden.description}
                                </Typography>
                                <Box sx={{display: "flex", mx: 3}}>
                                    {garden.tags &&
                                        <TagList tags={garden.tags}/>
                                    }
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={5} sx={{ minHeight: 0, height: 500 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: '1px solid #000',
                                borderRadius: 2,
                            }}>
                            <Box
                                component="img"
                                src={placeholderImage}
                                alt={garden.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    p: 4
                                }}
                            />
                            </Box>
                        </Grid>
                    </Grid>
                    
                    {gardenSectionTabSelected && (
                        <TabContext value={gardenSectionTabSelected} >
                            <TabList onChange={handleGardenSelectionTabChange}>
                                {garden.sections.map((section) => (
                                    <Tab key={section.id} value={section.id} label={section.name} />
                                ))}
                            </TabList>
                            {garden.sections.map((section) => (
                                <TabPanel key={section.id} value={section.id}>
                                    <Typography>Description: {section.description}</Typography>
                                    {user?.id === garden.user_id && (
                                        <Button 
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleAddPlantModalOpen}
                                        >
                                            Add New Plant
                                        </Button>
                                    )}
                                </TabPanel>
                            ))}
                        </TabContext>
                    )}

                    <GardenPlantList gardenPlants={gardenPlants}/>

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
                                <Box sx={{position: 'absolute', right: '2%', top: '2%'}}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{height: 30, width: 30, p: 0}}
                                        onClick={() => handleAddPlantModalClose()}
                                    >
                                        X
                                    </Button>
                                </Box>
                                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center'}}>
                                    Add New Plants
                                </Typography>
                                <Stack 
                                    direction="row"
                                    sx={{width: "100%", gap: 1}}
                                    justifyContent='center'
                                >
                                    <Typography sx={{alignContent: 'center'}}>
                                        Choose plants from our plant database
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

                                <Grid container sx={{mt: {xl: 1}}}>
                                    <Grid size={{xs:12, lg:5, xl:6}} sx={{alignContent: 'center'}}>
                                        {selectedPlants.length > 0 &&
                                            <Typography
                                                sx={{alignContent: 'center', fontWeight: 600, mr:{lg:2}, my:{xs:2, lg:0}}}
                                                variant="body1"
                                            >
                                                Currently Selected Plants: {selectedPlants.map(plant =>  {
                                                    const foundPlant = publicPlants.find(p => p.id === plant.plant_id)
                                                    const name = foundPlant?.common_name? foundPlant.common_name : foundPlant?.scientific_name

                                                    return plant.amount > 1 ? `${name} x${plant.amount}` : `${name}`

                                                    }).filter(Boolean).join(', ')
                                                }
                                            </Typography>
                                        }
                                    </Grid>
                                    
                                    <Grid size={{xs: 12, md:6, lg:4, xl:3}} sx={{pr: {md: 2}, alignContent: 'center', mb:{xs:2, md:0}}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker 
                                                maxDate={currentYear} 
                                                format="DD/MM/YYYY"
                                                label="Select Planted Date"
                                                sx={{width: '100%'}}
                                                value={plantedDate}
                                                onChange={(newDate) => setPlantedDate(newDate)}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    

                                    <Grid size={{xs: 12, md:6, lg:3}} sx={{alignContent: 'center'}}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            disabled={selectedPlants.length === 0}
                                            sx={{width: "100%", height: 56}}
                                            onClick={() => addGardenPlants()}
                                        >
                                            Add Plants
                                        </Button>
                                    </Grid>
                                    
                                    
                                    
                                    
                                </Grid>
                            </Stack>
                        </Box>
                    </Modal>
                </div>
            )}
        </>
    )
};

export default GardenPage;