import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useState, useEffect } from "react";
import { type Garden } from "../../types/garden";
import api from "../../client/client"
import { Box, Typography } from "@mui/material";
import TagList from "./tag-list";


const GardenPage = () => {
    const gardenId = useParams().gardenId;
    const [garden, setGarden] = useState<Garden | null>(null);

    const fetchGarden = async () => {
        try {
            const garden = await api.get("/gardens/" + gardenId)
            setGarden(garden.data)
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchGarden()
    }, []);


    return (
        
        <>
            <Navbar/>
            {garden && (
                <div>
                    <Typography variant="h3" sx={{fontWeight: 'bold', textAlign: 'center', pt: 4}}>
                        {garden.name}
                    </Typography>
                    <Typography variant="h5" sx={{textAlign: 'center', pt: 4}}>
                        {garden.description}
                    </Typography>
                    <Box sx={{display: "flex", mx: 'auto', justifyContent: 'center'}}>
                        {garden.tags &&
                            <TagList tags={garden.tags}/>
                        }
                    </Box>
                </div>
            )}
        </>
    )
};

export default GardenPage;