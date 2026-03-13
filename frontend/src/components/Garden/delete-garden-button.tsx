import { Button, Snackbar, Alert, type SnackbarCloseReason, Typography } from "@mui/material"
import { useState } from "react";
import api from "../../client/client"
import { useNavigate } from "react-router-dom";
import type { Garden } from "../../types/garden";
import ConfirmDeleteModal from "../common/confirmDeleteModal";

type DeleteGardenProps = {
    garden: Garden;
    onGardenDeleted: () => void;
};

const DeleteGardenButton = ({garden, onGardenDeleted}: DeleteGardenProps) => {
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
            onGardenDeleted();

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
            <ConfirmDeleteModal 
                modalOpen={deleteGardenModalOpen} 
                handleModalClose={handleDeleteGardenModalClose} 
                deleteFunction={deleteGarden} 
                title={"Are you sure you want to Delete this Garden?"} 
                body={
                    <Typography
                        fontWeight={500}
                        variant="h5"
                        sx={{textAlign: 'center'}}
                    >
                        {garden.name}
                    </Typography>
                } 
            />

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