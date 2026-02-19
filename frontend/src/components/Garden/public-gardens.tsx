import Navbar from "../common/Navbar";
import { Typography } from "@mui/material";
import GardenList from "./garden-list";
import { useEffect, useState } from "react";
import api from "../../client/client"
import type { Garden } from '../../types/garden';


const PublicGardens = () => {
    const [gardens, setGardens] = useState<Garden[]>([]);

    useEffect(() => {
        const fetchPublicGardens = async () => {
            try {
                const gardens = await api.get("/gardens/public")
                setGardens(gardens.data)

            } catch (err: any) {
                console.log(err)
            }
        }
        fetchPublicGardens()
    }, []);


    return (
        <>
            <Navbar />
            <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                Community Gardens
            </Typography>
            <GardenList gardens={gardens} isPersonalGardensPage={false}/>
        </>
    )
}

export default PublicGardens;