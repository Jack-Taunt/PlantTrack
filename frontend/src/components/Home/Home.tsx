import Navbar from '../common/Navbar';
import { Typography, Box } from '@mui/material';

function Home() {

    return (
        <Box
            sx={{
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Navbar/>
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: '#f9fafb',
                }}
            >
                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                    Home Page
                </Typography>
            </Box>
        </Box>
    )
};


export default Home;