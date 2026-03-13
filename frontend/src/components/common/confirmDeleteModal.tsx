import { Button, Modal, Typography, Box, Stack, Snackbar, Alert, type SnackbarCloseReason } from "@mui/material"
import { type ReactNode, useState } from "react";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type confirmDeleteModalProps = {
    modalOpen: boolean
    handleModalClose: () => void;
    deleteFunction: () => void;
    title: string
    body: ReactNode
    snackMessage: string
}

const ConfirmDeleteModal = ({modalOpen, handleModalClose, deleteFunction, title, body, snackMessage}: confirmDeleteModalProps) => {

    const [snackVisability, setSnackVisability] = useState(false);

    const handleSnackClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackVisability(false);
    }

    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        height: 220,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >   
                    <Box sx={{flexGrow: 1}}>
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                            >
                                <WarningAmberIcon sx={{fontSize: 64, pr: 3}}/>
                                <Typography
                                    variant="h5"
                                >
                                    {title}
                                </Typography>
                            </Stack>
                            {body}
                        </Stack>
                    </Box>
                    <Stack
                        direction="row"
                        sx={{width: "100%", py: "auto"}}
                        justifyContent='center'
                    > 
                        <Button 
                            onClick={() => {
                                deleteFunction()
                                setSnackVisability(true);
                            }}
                            variant="contained" 
                            sx={{width: '100%', ml: 2, mr: 2}}
                            color="error"
                        >
                            Delete
                        </Button>
                        <Button 
                            onClick={handleModalClose} 
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
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ConfirmDeleteModal;