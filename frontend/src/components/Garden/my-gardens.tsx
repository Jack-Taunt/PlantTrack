import { Button, Modal, Typography, Box, Stack, TextField, Checkbox, FormControlLabel, Alert, FormGroup } from '@mui/material';
import Navbar from '../common/Navbar';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import api from "../../client/client"

function Gardens() {
    const [createGardenModalOpen, setCreateGardenModalOpen] = useState(false);

    const handleCreateGardenModalOpen = () => setCreateGardenModalOpen(true);

    const handleCreateGardenModalClose = () => setCreateGardenModalOpen(false);

    const {
            register, 
            handleSubmit,
            setError,
            formState: { errors },
        } = useForm<GardenFormInputs>({
            reValidateMode: "onSubmit"
    });

    type GardenFormInputs = {
        name: string;
        description: string;
        isPublic: string;
    }

    const onSubmit: SubmitHandler<GardenFormInputs> = async (data) => {
        try {
            await api.post("/gardens/create", 
                {
                    name: data.name,
                    description: data.description,
                    isPublic: data.isPublic,
                }
            );

        } catch (err: any) {
            console.log(err.response)
        }
        
    }

    return (
        <>
            <Navbar/>
            <h1 style={{textAlign: 'center'}} >My Gardens</h1>
            
            <Button 
                variant='contained'
                onClick={handleCreateGardenModalOpen}
            >
                Create a New Garden
            </Button>
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
                        height: 500,
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

        </>
    )
};


export default Gardens;