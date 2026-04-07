import { Typography, Box, Paper, Grid, Chip, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import type { GardenPlant } from "../../types/plant";
import api from "../../client/client"
import ImageScroll from "../common/ImageScroll";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ParkIcon from "@mui/icons-material/Park";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import GrassIcon from "@mui/icons-material/Grass";
import OpacityIcon from "@mui/icons-material/Opacity";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import Masonry from '@mui/lab/Masonry';

const sectionStyles = {
    "General Information": { borderLeft: "8px solid #42a5f5",  },
    "Edibility": { borderLeft: "8px solid #66bb6a", },
    "Toxicity": { borderLeft: "8px solid #ef5350", },
    "Growth": { borderLeft: "8px solid #26a69a",  },
    "Planting": { borderLeft: "8px solid #26a69a" },
    "Plant Growth": { borderLeft: "8px solid #26a69a", },
    "Plant Environment": { borderLeft: "8px solid #ffa726", },
    "Plant Care": { borderLeft: "8px solid #ab47bc",  },
};

const sectionIcons = {
    "General Information": <InfoOutlinedIcon />,
    "Edibility": <RestaurantIcon />,
    "Toxicity": <WarningAmberIcon />,
    "Growth": <TrendingUpIcon />,
    "Planting": <ParkIcon />,
    "Plant Growth": <TrendingUpIcon />,
    "Plant Environment": <WbSunnyOutlinedIcon />,
    "Plant Care": <BuildOutlinedIcon />,
};

const subsectionIcons = {
    "Soil": <GrassIcon />,
    "Water": <OpacityIcon />,
    "Fertilizer": <ScienceOutlinedIcon />,
};

const PlantSection = ({title, children}: {title: keyof typeof sectionStyles; children:React.ReactNode}) => {
    return (
        <Paper elevation={3} sx={{...sectionStyles[title], p: 2, borderRadius: 2, height: "100%", backgroundColor: '#f9fafb'}}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {sectionIcons[title]}
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                {children}
            </Box>
        </Paper>
    )
}

const Subsection = ({ title }: { title: keyof typeof subsectionIcons; }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        {subsectionIcons[title]}
        <Typography
            sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
            }}
        >
            {title}
        </Typography>
    </Box>
);

const PlantField = ({label, value}: {label: string; value?: string}) => {
    if (!value) return null;    

    return (
        <Box sx={{display: "grid", gridTemplateColumns: "200px 1fr",
        alignItems: "center",}}>
            <Typography color="text.secondary">{label}</Typography>
            <Typography fontWeight={500}>{value}</Typography>
        </Box>
    )
}

const PlantBoolField = ({label, value}: {label: string; value?: boolean}) => {
    if (!value) return null;

    return (
        <Chip label={label} size="small" sx={{width: 160, height: 35}}/>
    )
}

const PlantRangeField = ({label, min, max, unit = ""}: {label: string, min: any, max: any, unit?: string}) => {
    if (min == null && max == null) return null;
    
    const rangeValue = min != null && max != null
        ? `${min} - ${max}${unit}`
        : `${min ?? max}${unit}`;

    return (
        <PlantField label={label} value={rangeValue}/>
    )
}

type GardenPlantProps = {
    gardenId?: number;
    plantId?: number;
    userOwns: boolean;
}

const GardenPlantInfo = ({gardenId, plantId, userOwns}: GardenPlantProps) => {

    const [gardenPlant, setGardenPlant] = useState<GardenPlant>();


    const fetchPlant = async (plantId: number) => {
        try {
            const plant = await api.get(`/gardens/${gardenId}/plant/${plantId}`)
            setGardenPlant(plant.data)
            
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!plantId) return;
        fetchPlant(plantId);
    }, [plantId])

    const handleImageUpload = () => {

    }

    const handleImageDelete = () => {

    }

    return (
        <>
            {gardenPlant && (
                <Box sx={{px:5, pt: 3, pb: 3}}>
                    <Paper elevation={2} sx={{borderRadius: 2}}>
                        <Grid container sx={{ px: 5}}>
                            <Grid size={5} sx={{height: "100%"}}>
                                {gardenPlant.plant.common_name && gardenPlant.plant.common_name.toLowerCase() !== gardenPlant.plant.scientific_name.toLowerCase() ? (
                                    <Typography variant="h5" sx={{fontSize: '1.75em', fontWeight: 'bold', pt: 2, mx: 3, borderBottom: '2px solid lightgray'}}>
                                        {gardenPlant.plant.common_name}{' '}
                                        {gardenPlant.plant.variety && (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: '0.8em', fontWeight: 400, fontStyle: 'italic' }}
                                            >
                                                ({gardenPlant.plant.variety})
                                            </Typography>
                                        )}
                                    </Typography>
                                ) : (
                                    <Typography variant="h5" sx={{fontSize: '1.75em', fontWeight: 'bold', pt: 2, mx: 3, borderBottom: '2px solid lightgray'}}>
                                        {gardenPlant.plant.scientific_name}{' '}
                                        {gardenPlant.plant.variety && (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: '0.8em', fontWeight: 400, fontStyle: 'italic' }}
                                            >
                                                ({gardenPlant.plant.variety})
                                            </Typography>
                                        )}
                                    </Typography>
                                )}

                                <ImageScroll 
                                    images={[]} 
                                    handleImageUpload={(handleImageUpload)} 
                                    canEdit={userOwns} 
                                    handleImageDelete={handleImageDelete}
                                />
                            </Grid>
                            <Grid container size={7} spacing={2} alignItems="stretch" sx={{pb: 10}}>
                                <Grid size={12}>
                                    <Box sx={{maxHeight: 200, overflow: "auto"}}>
                                        <Typography variant="h5" sx={{fontSize: '1.6rem', fontWeight: 'bold', pt: 2, mx: 3, borderBottom: '2px solid lightgray'}}>
                                            Notes
                                        </Typography>
                                        <Typography variant="h5" sx={{mx: 3, mb: 3}}>
                                            {gardenPlant.notes ?? "No Plant Notes"}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Masonry columns={2} spacing={2}>
                                    <Grid size={6}>
                                        <PlantSection title="General Information">
                                            <PlantField label={"Family"} value={gardenPlant.plant.family}/>
                                            <PlantField label={"Genus"} value={gardenPlant.plant.genus}/>
                                            <PlantField label={"Class"} value={gardenPlant.plant.class_}/>
                                            <PlantField label={"Order"} value={gardenPlant.plant.order}/>
                                            <PlantField label={"Phylum"} value={gardenPlant.plant.phylum}/>
                                        </PlantSection>
                                    </Grid>
                                    {gardenPlant.plant.care_requirements && (
                                        <Grid size={6}>
                                            <PlantSection title="Plant Care">
                                                <Subsection title="Soil"/>
                                                <PlantField label={"Soil Type"} value={String(gardenPlant.plant.care_requirements.soil_type)}/>
                                                <PlantField label={"Soil Moisture"} value={String(gardenPlant.plant.care_requirements.soil_moisture)}/>
                                                <PlantRangeField label={"Soil Ph"} min={gardenPlant.plant.care_requirements.min_soil_ph} max={gardenPlant.plant.care_requirements.max_soil_ph}/>
                                                
                                                <Subsection title="Water"/>
                                                <PlantBoolField label={"Drought Tolerant"} value={gardenPlant.plant.care_requirements.drought_tolerant}/>
                                                <PlantRangeField label={"Water Frequency"} min={gardenPlant.plant.care_requirements.min_water_frequency} max={gardenPlant.plant.care_requirements.max_water_frequency}/>

                                                
                                                <Subsection title="Fertilizer"/>
                                                <PlantField label={"Fertilizer Frequency"} value={String(gardenPlant.plant.care_requirements.fertilizer_frequency)}/>
                                                <PlantField label={"Nitrogen"} value={String(gardenPlant.plant.care_requirements.fertilizer_nitrogen)}/>
                                                <PlantField label={"Phosphorus"} value={String(gardenPlant.plant.care_requirements.fertilizer_phosphorus)}/>
                                                <PlantField label={"Potassium"} value={String(gardenPlant.plant.care_requirements.fertilizer_potassium)}/>
                                            </PlantSection>
                                        </Grid>
                                    )}
                                    {gardenPlant.plant.environment && (
                                        <Grid size={6}>
                                            <PlantSection title="Plant Environment">
                                                <PlantField label={"Light Type"} value={String(gardenPlant.plant.environment.light_type)}/>
                                                <PlantRangeField label={"Temperature"} min={gardenPlant.plant.environment.min_temp} max={gardenPlant.plant.environment.max_temp}/>
                                                <PlantRangeField label={"Humidity"} min={gardenPlant.plant.environment.min_humidity} max={gardenPlant.plant.environment.max_humidity}/>
                                                <PlantRangeField label={"usda Zone"} min={gardenPlant.plant.environment.min_usda_zone} max={gardenPlant.plant.environment.max_usda_zone}/>
                                            </PlantSection>
                                        </Grid>
                                    )}
                                    
                                    {gardenPlant.plant.growth && (
                                        <Grid size={6}>
                                            <PlantSection title="Plant Growth">
                                                <Stack gap={1} direction={"row"}>
                                                    <PlantBoolField label={"Annual"} value={gardenPlant.plant.growth.annual}/>
                                                    <PlantBoolField label={"Biennial"} value={gardenPlant.plant.growth.biennial}/>
                                                    <PlantBoolField label={"Perennial"} value={gardenPlant.plant.growth.perennial}/>
                                                </Stack>
                                                <PlantField label={"Growth Rate"} value={String(gardenPlant.plant.growth.growth_rate)}/>
                                                <PlantRangeField label={"Growth Width"} min={gardenPlant.plant.growth.min_width} max={gardenPlant.plant.growth.max_width}/>
                                                <PlantRangeField label={"Growth Height"} min={gardenPlant.plant.growth.min_height} max={gardenPlant.plant.growth.max_height}/>
                                                <PlantRangeField label={"Harvest Time"} min={gardenPlant.plant.growth.min_days_to_harvest} max={gardenPlant.plant.growth.max_days_to_harvest}/>
                                            </PlantSection>
                                        </Grid>
                                    )}
                                    {gardenPlant.plant.planting && (
                                        <Grid size={6}>
                                            <PlantSection title="Planting">
                                                <Stack gap={1} direction={"row"}>
                                                    <PlantBoolField label={"Can Direct Sow"} value={gardenPlant.plant.planting.direct_sow}/>
                                                    <PlantBoolField label={"Can Transplant"} value={gardenPlant.plant.planting.transplant}/>
                                                    <PlantBoolField label={"Can Propagate"} value={gardenPlant.plant.planting.propagation}/>
                                                </Stack>
                                                <PlantField label={"Seed Planting Depth (cm)"} value={String(gardenPlant.plant.planting.seed_depth)}/>
                                                <PlantField label={"Plant Spacing (cm)"} value={String(gardenPlant.plant.planting.spacing)}/>
                                            </PlantSection>
                                        </Grid>
                                    )}
                                    {gardenPlant.plant.toxicity && (
                                        <Grid size={6}>
                                            <PlantSection title="Toxicity">
                                                <PlantField label={"Toxicity"} value={String(gardenPlant.plant.toxicity.toxicity)}/>
                                                {gardenPlant.plant.toxicity.toxicity !== "non_toxic" && (
                                                    <Stack gap={1} direction={"row"}>
                                                        <PlantBoolField label={"Toxic to Humans"} value={gardenPlant.plant.toxicity.toxic_to_humans}/>
                                                        <PlantBoolField label={"Toxic to Cats"} value={gardenPlant.plant.toxicity.toxic_to_cats}/>
                                                        <PlantBoolField label={"Toxic to Dogs"} value={gardenPlant.plant.toxicity.toxic_to_dogs}/>
                                                    </Stack>
                                                )}
                                            </PlantSection>
                                        </Grid>
                                    )}
                                    {gardenPlant.plant.edibility && (
                                        <Grid size={6}>
                                            <PlantSection title="Edibility">
                                                {!gardenPlant.plant.edibility.edible_fruit && 
                                                !gardenPlant.plant.edibility.edible_leaves && 
                                                !gardenPlant.plant.edibility.edible_flowers &&
                                                !gardenPlant.plant.edibility.edible_roots ? (
                                                    <PlantBoolField label={"Not Edible"} value={true}/>
                                                ) : (
                                                    <Stack gap={1} direction={"row"}>
                                                        <PlantBoolField label={"Edible Fruit"} value={gardenPlant.plant.edibility.edible_fruit}/>
                                                        <PlantBoolField label={"Edible Leaves"} value={gardenPlant.plant.edibility.edible_leaves}/>
                                                        <PlantBoolField label={"Edible Flowers"} value={gardenPlant.plant.edibility.edible_flowers}/>
                                                        <PlantBoolField label={"Edible Roots"} value={gardenPlant.plant.edibility.edible_roots}/>
                                                    </Stack>
                                                )}
                                            </PlantSection>
                                        </Grid>
                                    )}
                                </Masonry>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            )}
        </>
            
    )
}

export default GardenPlantInfo;