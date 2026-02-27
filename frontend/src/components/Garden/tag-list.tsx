import { type Tag } from "../../types/garden";
import TagBubble from "./tag";
import { List, ListItem } from "@mui/material";

type TagListProps = {
  tags: Tag[];
};

const TagList = ({tags}: TagListProps) => {
    return (
        <List sx={{display: 'flex', flexDirection: 'row', pl: 0.5, pt: 3.5, pb: 0, overflow: 'hidden'}}>
            {tags.map((tag) => {
                return (
                    <ListItem key={tag.id} sx={{width: "auto", padding: "3px"}}>
                        <TagBubble tag={tag}/>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default TagList;