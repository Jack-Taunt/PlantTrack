import { Button, Snackbar, Alert, type SnackbarCloseReason, Modal, Typography, Box, Stack } from "@mui/material"
import { useState } from "react";
import api from "../../client/client"
import { useNavigate } from "react-router-dom";
import type { Garden } from "../../types/garden";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type DeleteGardenProps = {
    garden: Garden;
};

const DeleteGardenButton = ({garden}: DeleteGardenProps) => {
    const [deleteGardenModalOpen, setDeleteGardenModalOpen] = useState(false);

    const handleDeleteGardenModalOpen = () => setDeleteGardenModalOpen(true);
    const handleDeleteGardenModalClose = () => setDeleteGardenModalOpen(false);
    
    const [snackVisability, setSnackVisability] = useState(false);

    const navigate = useNavigate();

    const handleSnackClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackVisability(false);
    }

    const deleteGarden = async () => {
        try {
            const response = await api.delete(`/gardens/${garden.id}`)
            console.log(response.data)
            handleDeleteGardenModalClose();
            setSnackVisability(true);

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


    return (
        <>
            <Button 
                variant="contained"
                color="error"
                sx={{width: '100%', mr: 3}}
                onClick={handleDeleteGardenModalOpen}
            >
                Delete Garden
            </Button>

            <Modal
                open={deleteGardenModalOpen}
                onClose={handleDeleteGardenModalClose}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        height: 200,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >   
                    <Box sx={{flexGrow: 1}}>
                        <Stack spacing={4}>
                            <Stack
                                direction="row"
                            >
                                <WarningAmberIcon sx={{fontSize: 64, pr: 3}}/>
                                <Typography
                                    variant="h5"
                                >
                                    Are you sure you want to Delete this Garden?
                                </Typography>
                            </Stack>
                            <Typography
                                fontWeight={500}
                                variant="h5"
                                sx={{textAlign: 'center'}}
                            >
                                {garden.name}
                            </Typography>
                        </Stack>
                    </Box>
                    <Stack
                        direction="row"
                        sx={{width: "100%", pt: 2}}
                        justifyContent='center'
                    > 
                        <Button 
                            onClick={deleteGarden}
                            variant="contained" 
                            sx={{width: '100%', ml: 2, mr: 2}}
                            color="error"
                        >
                            Delete
                        </Button>
                        <Button 
                            onClick={handleDeleteGardenModalClose} 
                            variant="contained" 
                            sx={{width: '100%', ml: 2, mr: 2}}
                        >
                            Cancel
                        </Button>  
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
                    Garden Deleted
                </Alert>
            </Snackbar>
        </>
    )
}

export default DeleteGardenButton;