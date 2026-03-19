import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useRef, useEffect } from "react";
import { type Section } from "../../types/garden";
import { Tab } from "@mui/material";

type DraggableTabProps = {
    section: Section;
    index: number;
    moveTab: (from: number, to: number) => void;
    onDragEnd: () => void;
    draggingDisabled: boolean
} & React.ComponentProps<typeof Tab>;

const DraggableTab = ({ section, index, moveTab, onDragEnd, draggingDisabled, children, ...props }: DraggableTabProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current || draggingDisabled) return;

        const cleanupDrag = draggable({
            element: ref.current,
            getInitialData: () => ({
                id: section.id,
            }),

            
        });

        const cleanupDrop = dropTargetForElements({
            element: ref.current,

            getData: () => ({
                id: section.id,
            }),

            onDragEnter: ({ source }) => {
                const sourceData = source.data as {id: number};
                if (sourceData.id === section.id) return;

                moveTab(sourceData.id, section.id);
            },

            onDrop: () => {
                onDragEnd();
            }
        });

        return () => {
            cleanupDrag();
            cleanupDrop();
        };
    }, [index, section.id, moveTab]);

    return (
        <Tab
            ref={ref}
            component="div"
            {...props}
        >
            {children}
        </Tab>
    );
};

export default DraggableTab