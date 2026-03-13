import { Button, Modal, Typography, Box, Stack } from "@mui/material"
import type { ReactNode } from "react";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type confirmDeleteModalProps = {
    modalOpen: boolean
    handleModalClose: () => void;
    deleteFunction: () => void;
    title: string
    body: ReactNode
}

const ConfirmDeleteModal = ({modalOpen, handleModalClose, deleteFunction, title, body}: confirmDeleteModalProps) => {


    return (
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
                    <Stack spacing={4}>
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
                    sx={{width: "100%", py: 2}}
                    justifyContent='center'
                > 
                    <Button 
                        onClick={deleteFunction}
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
    )
}

export default ConfirmDeleteModal;