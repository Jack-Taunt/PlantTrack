import { Box, Typography } from "@mui/material";
import type { Tag } from "../../types/garden";

interface TagProps {
    tag: Tag;
}

const TagBubble = ({tag}: TagProps) => {

    return (
        <Box sx={{py: 0.5, px: 1.5, borderRadius: 2, backgroundColor: "#b6e6ac"}}>

            <Typography fontWeight={500} color="#0f5c00">
                {tag.name}
            </Typography>
        </Box>
    )
}

export default TagBubble;