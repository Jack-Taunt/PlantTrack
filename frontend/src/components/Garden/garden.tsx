import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import { useState, useEffect } from "react";
import { type Garden } from "../../types/garden";
import api from "../../client/client"
import { type Tag } from "../../types/garden";
import { Typography } from "@mui/material";


const GardenPage = () => {
    const gardenId = useParams().gardenId;
    const [garden, setGarden] = useState<Garden | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    


    const fetchGarden = async () => {
        try {
            const garden = await api.get("/gardens/" + gardenId)
            setGarden(garden.data)
            
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

    useEffect(() => {
        fetchGarden()
        fetchGardenTags()
    }, []);


    return (
        <>
            <Navbar/>
            <Typography>
                {garden?.name}
            </Typography>
        </>
    )
};

export default GardenPage;