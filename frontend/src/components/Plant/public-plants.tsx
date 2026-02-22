import { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import PlantList from "./plant-list";
import { type Plant } from "../../types/plant";
import api from "../../client/client"

const PublicPlantsPage = () => {
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        const fetchPublicPlants = async () => {
            try {
                const plants = await api.get("/plants/public")
                setPlants(plants.data)

            } catch (err: any) {
                console.log(err)
            }
        }
        fetchPublicPlants()
    }, []);
    

    return (
        <>
            <Navbar />
            <PlantList plants={plants}/>
        </>
    )
}

export default PublicPlantsPage;