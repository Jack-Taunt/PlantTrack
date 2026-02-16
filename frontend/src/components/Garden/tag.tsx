import { Box, Typography } from "@mui/material";
import type { Tag } from "../../types/garden";

interface TagProps {
    tag: Tag;
}

const TagBubble = ({tag}: TagProps) => {

    return (
        <Box sx={{padding: 0.5, border: "1px solid", borderColor: '#000', borderRadius: 2, backgroundColor: "secondary.main"}}>

            <Typography fontWeight={500}>
                {tag.name}
            </Typography>
        </Box>
    )
}

export default TagBubble;