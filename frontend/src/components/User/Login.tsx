import { Card, CardContent, Grid, Stack, TextField, Typography, Box, Button, Link, Alert } from "@mui/material";
import api from "../../client/client"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../common/AuthProvider";

const Login = () => {

    const {
        register, 
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    type LoginFormInputs = {
        username: string;
        password: string;
    }

    const { setUser } = useAuth();

    const navigate = useNavigate()
    const location = useLocation();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const formData = new URLSearchParams();
        formData.append("username", data.username);
        formData.append("password", data.password);
        try{
            const response = await api.post("/users/token", 
                formData, 
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }
            );
            const from = (location.state as any)?.from || "/";
            navigate(from);
            setUser(response.data.user);

        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("root", {
                    type: "server",
                    message: "Incorrect email or password",
                })
            } else {
                setError("root", {
                    type: "server",
                    message: "Something went wrong. Try again later",
                })
            }
        }
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
                        maxHeight: 500,
                        width: '100%',
                        height: '100%',
                        margin: '16px'
                    }}
                >
                    <CardContent sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Stack spacing={5} alignItems="stretch" width="100%">
                            <Box sx={{paddingTop:3}}>
                                <Typography variant="h4" sx={{fontWeight: 'bold', textAlign: 'center'}} fontWeight={400}>
                                    Sign In
                                </Typography>
                            </Box>
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack sx={{ gap: 2 }} alignItems="center">
                                    <TextField label="Email" variant="filled" required={true} {...register("username")} sx={{width: '80%'}} />
                                    <TextField label="password" variant="filled" required={true} type="password" {...register("password")} sx={{width: '80%'}} />
                                    <Link href="/forgot-password" variant="body2">Forgot Password?</Link>
                                    {errors.root && (
                                        <Alert severity="error" sx={{width: "73%"}}>
                                            {errors.root.message}
                                        </Alert>
                                    )}
                                    <Button type="submit" variant="contained" sx={{width: "80%", marginTop: 3}}>Sign In</Button>
                                    <Link href="/register" variant="body2">Don't have an Account? Register Here!</Link>
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