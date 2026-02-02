import { Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";
import api from "../../client/client"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const {
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm<LoginFormInputs>();

    type LoginFormInputs = {
        username: string;
        password: string;
    }

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const formData = new URLSearchParams();
        formData.append("username", data.username);
        formData.append("password", data.password);

        const response = await api.post("/users/token", 
            formData, 
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
        
        navigate("/")
    };

    return (
        <>
            <Grid 
                container 
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
            >
                <Card
                    sx={{
                        maxWidth: 500,
                        maxHeight: 600,
                        width: '100%',
                        height: '100%',
                        margin: '16px'
                    }}
                >
                    <CardContent>
                        <Stack spacing={5} alignItems="center">
                            <Typography>Login</Typography>
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={2} alignItems="center">
                                    <TextField label="Username" variant="filled" {...register("username")} />
                                    <TextField label="password" variant="filled" {...register("password")} />
                                    <input type="submit" />
                                </Stack>

                            </form>
                        </Stack>
                    </CardContent>

                </Card>
            </Grid>
        </>
    )
}

export default Login