import { Button, Modal, Typography, Box, Stack, TextField, Checkbox, FormControlLabel, Alert, FormGroup, Snackbar, type SnackbarCloseReason, FormControl, InputLabel, Select, OutlinedInput, Chip, MenuItem } from '@mui/material';
import Navbar from '../common/Navbar';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { type SubmitHandler, Controller } from "react-hook-form";
import api from "../../client/client"
import { useLocation, useNavigate } from 'react-router-dom';
import type { Garden, Tag, GardenImage } from '../../types/garden';
import GardenList from './garden-list';

function MyGardensPage() {
    const [createGardenModalOpen, setCreateGardenModalOpen] = useState(false);
    const [gardens, setGardens] = useState<Garden[]>([]);
    const [gardenImages, setGardenImages] = useState<GardenImage[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const handleCreateGardenModalOpen = () => setCreateGardenModalOpen(true);

    const handleCreateGardenModalClose = () => {
        setCreateGardenModalOpen(false);
        reset({});
    }
    const [snackVisability, setSnackVisability] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();


    const handleSnackClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackVisability(false);
    }


    const {
            register, 
            handleSubmit,
            reset,
            setError,
            control,
            formState: { errors },
        } = useForm<GardenFormInputs>({
            reValidateMode: "onSubmit"
    });


    type GardenFormInputs = {
        name: string;
        description: string;
        isPublic: string;
        tags: number[];
    }


    const onSubmit: SubmitHandler<GardenFormInputs> = async (data) => {
        try {
            await api.post("/gardens", 
                {
                    name: data.name,
                    description: data.description,
                    is_public: data.isPublic,
                    tags: data.tags,
                }
            );
            handleCreateGardenModalClose();
            setSnackVisability(true);
            fetchGardens();

        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate("/login", {
                    state: {from: location.pathname},
                    replace: true
                })

            } else if (err.response?.status === 500) {
                setError("root", {
                    type: "server",
                    message: "Something went wrong. Try again later",
                })

            } else {
                for (let val of err.response.data.detail) {
                    let input_field = val.loc[1]
                    let error_message = val.msg

                    setError(input_field, {
                        type: "server",
                        message: error_message,
                    })
                }
            }
        }
        
    }
    const fetchGardens = async () => {
        try {
            const gardens = await api.get("/gardens/me")
            setGardens(gardens.data)

            gardens.data.forEach((garden: Garden) => {
                if (garden.garden_images.length > 0) {
                    fetchGardenImage(garden.id, garden.garden_images[0].id)
                }
            })
            
        } catch (err: any) {
            console.log(err)
        }
    }

    const fetchGardenTags = async () => {
        try {
            const tags = await api.get("/gardens/tags")
            setTags(tags.data)
        } catch (err: any) {
            console.log(err)
        }
    }

    const fetchGardenImage = async (gardenId: number, imageId: number) => {
        try {
            const image = await api.get(`/gardens/${gardenId}/image/${imageId}`,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(image.data);
            

            setGardenImages(prev => {
                if (prev.find(img => img.id === gardenId)) return prev;
                return [...prev, {id: gardenId, image: url}]
            });
            
        } catch (err: any) {
            console.log(err.response)
        }
    }

    useEffect(() => {
        fetchGardens()
        fetchGardenTags()
    }, []);


    return (
        <>
            <Navbar/>
            <Box sx={{backgroundColor: '#f9fafb'}}>
                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                    My Gardens
                </Typography>
                
                <Button 
                    variant='contained'
                    onClick={handleCreateGardenModalOpen}
                >
                    Create a New Garden
                </Button>


                <GardenList gardens={gardens} gardenImages={gardenImages} onGardenDeleted={fetchGardens}/>


                <Modal
                    open={createGardenModalOpen}
                    onClose={handleCreateGardenModalClose}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 500,
                            minHeight: 500,
                            maxHeight: 620,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4
                        }}
                    >
                        <Stack spacing={5} alignItems="stretch" width="100%">
                                <Box sx={{paddingTop:3}}>
                                    <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center'}}>
                                        Create a New Garden
                                    </Typography>
                                </Box>
                                
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack sx={{ gap: 2 }} alignItems="center">
                                        <TextField 
                                            label="Garden Name" 
                                            variant="filled" 
                                            required={true} 
                                            {...register("name")} 
                                            sx={{width: '80%'}} 
                                            helperText="e.g Veggie Garden or Indoor Plants"
                                        />
                                        {errors.name && (
                                            <Alert severity="error" sx={{width: "73%"}}>
                                                {errors.name.message}
                                            </Alert>
                                        )}
                                        <TextField 
                                            label="Garden Description" 
                                            variant="filled" 
                                            multiline
                                            rows={4} 
                                            required={true} 
                                            {...register("description")} 
                                            sx={{width: '80%'}} 
                                        />
                                        {errors.description && (
                                            <Alert severity="error" sx={{width: "73%"}}>
                                                {errors.description.message}
                                            </Alert>
                                        )}

                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox {...register("isPublic")} />} label="Make Garden Public?" />
                                        </FormGroup>
                                        
                                        <Controller
                                            name="tags"
                                            control={control}
                                            defaultValue={[]}
                                            render={({field}) => (
                                                <FormControl sx={{width: "80%"}}>
                                                    <InputLabel id="garden-tags">Tags</InputLabel>
                                                    <Select
                                                        labelId='garden-tags'
                                                        multiple
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value.length <= 5) field.onChange(value);
                                                        }}
                                                        input={<OutlinedInput label="Chip" />}
                                                        renderValue={(selected) => (
                                                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                                                {selected.map((id) => {
                                                                    const tag = tags.find(t => t.id === id);
                                                                    return <Chip key={id} label={tag?.name} />
                                                                })}
                                                            </Box>
                                                        )}
                                                    >
                                                        {tags.map((tag) => (
                                                        <MenuItem
                                                            key={tag.id}
                                                            value={tag.id}
                                                        >
                                                            {tag.name}
                                                        </MenuItem>
                                                        ))}  
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                        <Typography variant='caption' sx={{pt: 0}}>
                                            Maxiumum 5 tags per Garden
                                        </Typography>

                                        {errors.root && (
                                            <Alert severity="error" sx={{width: "73%"}}>
                                                {errors.root.message}
                                            </Alert>
                                        )}
                                        <Stack
                                            direction="row"
                                            sx={{width: "80%", gap: 1}}
                                            justifyContent='center'
                                        > 
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                sx={{ marginTop: 3, width: '100%'}}
                                            >
                                                Create Garden
                                            </Button>
                                            <Button 
                                                onClick={handleCreateGardenModalClose} 
                                                variant="contained" 
                                                sx={{ marginTop: 3, width: '100%'}}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </form>
                            </Stack>

                    </Box>
                </Modal>

                <Snackbar
                    open={snackVisability}
                    autoHideDuration={5000}
                    onClose={handleSnackClose}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Garden Successfully Created
                    </Alert>
                </Snackbar>
            </Box>
        </>
    )
};


export default MyGardensPage;