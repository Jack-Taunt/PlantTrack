import Navbar from '../common/Navbar';
import { Typography } from '@mui/material';

function Home() {

    return (
        <>
            <Navbar/>
            <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                Home Page
            </Typography>
            

        </>
    )
};


export default Home;