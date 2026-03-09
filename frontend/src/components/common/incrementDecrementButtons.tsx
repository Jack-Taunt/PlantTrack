import { Button, ButtonGroup, Box, Typography } from "@mui/material";
import { useState } from "react";

type IncrementDecrementButtonsProps = {
    setValueCallback: (value: number) => void;
}

const IncrementDecrementButtons = ({setValueCallback}: IncrementDecrementButtonsProps) => {
    const [value, setValue] = useState<number>(1);

    const handleIncrement = (e: React.MouseEvent) => {
        setValue(value+1)
        setValueCallback(value+1)
        e.stopPropagation()
    }

    const handleDecrement = (e: React.MouseEvent) => {
        setValue(value-1)
        setValueCallback(value-1)
        e.stopPropagation()
    }

    const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

    return (
        <Box
            onMouseDown={stopPropagation}
            sx={{ width: "100%", height: "100%" }}
        >
            <ButtonGroup
                fullWidth
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    "& .MuiButton-root": {
                        flex: 1,
                        minWidth: 0,
                        padding: 0,
                    }
                }}
                onPointerDown={stopPropagation}
            >
                <Button sx={{border: "1px solid #000", color: "#000"}} onClick={handleIncrement}>+</Button>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #000",
                    }}
                    onClick={stopPropagation}
                >
                    <Typography>{value}</Typography>
                </Box>
                <Button sx={{border: "1px solid #000", color: "#000"}} onClick={handleDecrement}>-</Button>
            </ButtonGroup>
        </Box>
    )
}

export default IncrementDecrementButtons;