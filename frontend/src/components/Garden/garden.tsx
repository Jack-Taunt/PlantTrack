import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useState, useEffect, type SyntheticEvent } from "react";
import { type Garden } from "../../types/garden";
import api from "../../client/client"
import { Box, Button, Typography, Modal, Stack, Grid, Tab, tabsClasses, TextField } from "@mui/material";
import TagList from "./tag-list";
import { useAuth } from "../common/AuthProvider";
import PlantList from "../Plant/plant-list";
import { type Plant, type GardenPlant } from "../../types/plant";
import GardenPlantList from "../Plant/garden-plant-list";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from 'dayjs';
import {type GardenPlantAmount} from "../../types/garden";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ConfirmDeleteModal from "../common/confirmDeleteModal";
import DraggableTab from "./garden_section_draggable_tab";
import { type Section } from "../../types/garden";
import ImageScroll from "../common/ImageScroll";

const GardenPage = () => {
    const gardenId = useParams().gardenId;
    const { user } = useAuth();

    const [garden, setGarden] = useState<Garden | null>(null);
    const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
    const [sections, setSections] = useState<Section[]>([]);

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

    const navigate = useNavigate();

    const fetchGarden = async () => {
        try {
            const garden = await api.get(`/gardens/${gardenId}`)
            setGarden(garden.data)
            setSections(garden.data.sections)
            if (garden.data.sections.length > 0 && selectedTab === -1) {
                const firstSection = garden.data.sections.reduce((a: Section, b: Section) => b.order < a.order ? b : a, garden.data.sections[0])
                setSelectedTab(firstSection.id)
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
                    section_id: selectedTab,
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


    const [selectedTab, setSelectedTab] = useState<number>(-1);

    const handleGardenSelectionTabChange = (_: SyntheticEvent, newSectionTabId: number) => {
        if (newSectionTabId === -1) return;
        setSelectedTab(newSectionTabId);
    }
    
    const handleCreateNewSection = async () => {
        try {
            const sectionNumber = garden?.sections.length ? garden?.sections.length + 1 : 1
            const section = await api.post(`/gardens/${gardenId}/section`,
                {
                    name: `Section ${sectionNumber}`
                }
            )
            await fetchGarden();
            setSelectedTab(section.data.id);
        } catch (err: any) {
            console.log(err)
        }
    }

    const [editingSectionName, setEditingSectionName] = useState<number | null>(null);
    const [sectionName, setSectionName] = useState<string>();

    const [editingSectionDescription, setEditingSectionDescription] = useState<number | null>();
    const [sectionDescription, setSectionDescription] = useState<string>();

    const editSection = async (sectionId: number, name: string | undefined, description: string | undefined, order: number | undefined) => {
        try {
            await api.put(`/gardens/${gardenId}/section/${sectionId}`,
                {
                    name: name,
                    description: description,
                    order: order
                }
            )
            await fetchGarden();
        } catch (err: any) {
            console.log(err)
        }
    }


    const saveSectionName = async () => {
        setEditingSectionName(null);
        editSection(selectedTab, sectionName, undefined, undefined)
    }

    const saveSectionDescription = async () => {
        setEditingSectionDescription(null);
        editSection(selectedTab, undefined, sectionDescription, undefined)
    }


    const [deleteSectionModalOpen, setDeleteSectionModalOpen] = useState(false);
    const handleDeleteSectionModalOpen = () => setDeleteSectionModalOpen(true);
    const handleDeleteSectionModalClose = () => setDeleteSectionModalOpen(false);

    const deleteSection = async () => {
        try {
            await api.delete(`/gardens/${gardenId}/section/${selectedTab}`)

            handleDeleteSectionModalClose();
            await fetchGarden();

        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate("/login", {
                    state: {from: location.pathname},
                    replace: true
                })
            } else if (err.response?.status === 500) {
                console.log(err.response)
            }
        }
    }


    const moveTab = (sourceId: number, targetId: number) => {

        const fromIndex = sections.findIndex(s => s.id === sourceId);
        const toIndex = sections.findIndex(s => s.id === targetId);
        
        const updatedSections = [...sections];

        const [moved] = updatedSections.splice(fromIndex, 1);
        updatedSections.splice(toIndex, 0, moved);

        const newSections = updatedSections.map((s, index) => ({
            ...s,
            order: index
        }));

        setSections(newSections)
    };

    const moveTabEnd = async () => {
        sections.forEach((section) => {
            editSection(section.id, undefined, undefined, section.order)
        })
        
    }

    const handleImageUpload = async (event: any) => {
        console.log(event.target.files[0])

        const formData = new FormData()
        formData.append('file', event.target.files[0])

        try {
            await api.post(`/gardens/${gardenId}/uploadimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
        } catch (err: any) {
            console.log(err.response)
        }
    }

    const [imageSrc, setImageSrc] = useState<string|null>(null);

    const fetchImage = async (imageId: number) => {
        try {
            const image = await api.get(`/gardens/${gardenId}/image/${imageId}`,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(image.data);
            setImageSrc(url);
            
        } catch (err: any) {
            console.log(err.response)
        }
    }


    useEffect(() => {
        if (garden && garden.garden_images?.length > 0) {
            fetchImage(garden.garden_images[0].id)
        }
    }, [garden])


    return (
        <>
            <Navbar/>
            {garden && (
                <div>
                    <Typography variant="h3" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                        {garden.name}
                    </Typography>
                    <Grid container sx={{height: 600, p: 5}}>
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
                        <Grid size={5} sx={{ minHeight: 0, height: "100%", display: 'flex', position: 'relative' }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: '1px solid #000',
                                borderRadius: 2,
                            }}>
                                <ImageScroll imageSrc={imageSrc} handleImageUpload={handleImageUpload}/>
                            </Box>
                        </Grid>
                    </Grid>
                    

                    <Box sx={{px:5}}>
                        <Box sx={{border: '1px solid', borderRadius: 2, overflow: 'hidden'}}>
                            <Box>
                                <TabContext value={selectedTab} >

                                    <TabList 
                                        onChange={handleGardenSelectionTabChange} 
                                        variant="scrollable" 
                                        allowScrollButtonsMobile
                                        sx={{
                                            [`& .${tabsClasses.scrollButtons}`]: {
                                                '&.Mui-disabled': { opacity: 0.3 },
                                                border: 1,
                                                backgroundColor: "secondary.main",
                                                color: 'black'
                                            },
                                            borderBottom: 1
                                        }}
                                        >
                                        {sections
                                            .sort((a, b) => a.order - b.order)
                                            .map((section, index) => (
                                            <DraggableTab 
                                                key={section.id}
                                                section={section}
                                                index={index}
                                                moveTab={moveTab}
                                                onDragEnd={moveTabEnd}
                                                value={section.id}
                                                draggingDisabled={editingSectionName !== null}
                                                label=
                                                {   
                                                    (editingSectionName === section.id) ? 
                                                    (
                                                        <div>
                                                            <TextField
                                                                value={sectionName}
                                                                variant="standard"
                                                                autoFocus
                                                                onBlur={() => saveSectionName()}
                                                                onChange={(e) => setSectionName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        saveSectionName()
                                                                    }
                                                                }}
                                                                sx={{
                                                                    '& .MuiInputBase-input': {
                                                                        fontWeight: 'bold',
                                                                        fontSize: '1rem',
                                                                        textTransform: 'none',
                                                                        color: selectedTab === section.id ? 'primary.main' : 'black',
                                                                        p: 0,
                                                                        textAlign: 'center'
                                                                    }
                                                                }}
                                                            />
                                                            <span
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    handleDeleteSectionModalOpen();
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 1,
                                                                    right: 2,
                                                                    cursor: 'pointer',
                                                                    fontSize: '1.5rem',
                                                                    fontWeight: 'bold',
                                                                    lineHeight: 1,
                                                                    padding: '1px 2px',
                                                                    backgroundColor: '#ff0000',
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                ✕
                                                            </span>
                                                        </div>

                                                    ) : (
                                                        <Typography 
                                                            variant="body1" 
                                                            onDoubleClick={() => {
                                                                setEditingSectionName(section.id)
                                                                setSectionName(section.name)
                                                            }} 
                                                            sx={{
                                                                textTransform: 'none', 
                                                                fontWeight: 'bold', 
                                                                color: selectedTab === section.id? 'primary.main' : "black"
                                                            }}
                                                        >
                                                            {section.name}
                                                        </Typography>
                                                    )
                                                } 
                                                sx={{
                                                    width: { xs: 50, sm: 150, md: 250, xl: 400 },
                                                    flexShrink: 0,
                                                    backgroundColor: selectedTab === section.id? '#dedede' : "#ffffff",
                                                    '&:hover': {
                                                        backgroundColor: '#dedede',
                                                    },
                                                }} 
                                            />
                                        ))}
                                        <Tab 
                                            value={-1}
                                            onMouseDown={handleCreateNewSection}
                                            sx={{
                                                backgroundColor: "secondary.main", 
                                                color: 'white',
                                                '&.Mui-disabled': {
                                                    opacity: 1,
                                                    color: 'white',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: "secondary.main",
                                                    color: 'white',
                                                }
                                            }}
                                            label={"+ Add New Section"} 
                                        />
                                    </TabList>
                                    
                                    
                                    {sections.map((section) => (
                                        <TabPanel key={section.id} value={section.id} sx={{py: 1}}>
                                            {editingSectionDescription ? (
                                                <TextField
                                                    value={sectionDescription}
                                                    variant="standard"
                                                    autoFocus
                                                    onBlur={() => saveSectionDescription()}
                                                    onChange={(e) => setSectionDescription(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            saveSectionDescription()
                                                        }
                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                        border: '1px solid transparent',
                                                        borderRadius: 1,
                                                        px: 0.5,
                                                        my: 2,
                                                        borderColor: 'primary.main',
                                                        '& .MuiInputBase-root': {
                                                            p: 0,
                                                            alignItems: 'center',
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            fontSize: '1.25rem',
                                                            fontWeight: 500,
                                                            lineHeight: '1.6',
                                                            letterSpacing: '0.0075em',
                                                            p: 0,
                                                            height: 'auto',
                                                        },
                                                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                                                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    onClick={() => {
                                                        setEditingSectionDescription(section.id)
                                                        setSectionDescription(section.description)
                                                    }}
                                                    sx={{
                                                        fontSize: '1.25rem',
                                                        fontWeight: 500,
                                                        lineHeight: '1.6',
                                                        letterSpacing: '0.0075em',
                                                        width: '100%',
                                                        border: '1px solid transparent',
                                                        borderRadius: 1,
                                                        px: 0.5,
                                                        my: 2,
                                                        cursor: 'text',
                                                        '&:hover': { borderColor: 'divider' },
                                                        fontStyle: section.description ? 'normal' : 'italic',
                                                        color: section.description ? 'inherit' : 'text.secondary',
                                                    }}
                                                >
                                                    {section.description || "+ Add a description..."}
                                                </Typography>
                                            )}
                                            {user?.id === garden.user_id && (
                                                <Button 
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={handleAddPlantModalOpen}
                                                >
                                                    Add New Plant
                                                </Button>
                                            )}
                                            <GardenPlantList gardenPlants={gardenPlants.filter(gardenPlant => gardenPlant.section_id === section.id)}/>
                                        </TabPanel>
                                    ))}
                                </TabContext>
                            </Box> 
                        </Box>
                    </Box>

                    <ConfirmDeleteModal 
                        modalOpen={deleteSectionModalOpen} 
                        handleModalClose={handleDeleteSectionModalClose} 
                        deleteFunction={deleteSection} 
                        title={"Are you sure you want to Delete this Section?"} 
                        body={
                            <div>
                                <Typography
                                    fontWeight={500}
                                    variant="h6"
                                    sx={{textAlign: 'center'}}
                                >
                                    {sectionName}
                                </Typography>
                                <Typography
                                    sx={{textAlign: 'center'}}
                                >
                                    All plants will also be deleted!
                                </Typography>
                            </div>
                        } 
                        snackMessage="Section Successfully Deleted!"
                    />

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