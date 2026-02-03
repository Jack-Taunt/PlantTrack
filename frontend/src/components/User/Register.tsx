import api from "../../client/client"
import { useNavigate } from "react-router-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Card, CardContent, Grid, Stack, TextField, Typography, Box, Button, Link } from "@mui/material";

const Register = () => {

    const {
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm<RegisterFormInputs>();

    type RegisterFormInputs = {
        email: string;
        username: string;
        password: string;
    }

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {

        const response = await api.post("/users/register", 
            {
                email: data.email,
                username: data.username,
                password: data.password,
            }
        );

        navigate("/")
    }


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
                                    Register New Account
                                </Typography>
                            </Box>
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack sx={{ gap: 2 }} alignItems="center">
                                    <TextField label="Email" variant="filled" required={true} {...register("email")} sx={{width: '80%'}} />
                                    <TextField label="Username" variant="filled" required={true} {...register("username")} sx={{width: '80%'}} />
                                    <TextField label="password" variant="filled" required={true} type="password" {...register("password")} sx={{width: '80%'}} />
                                    <Button type="submit" variant="contained" sx={{width: "80%", marginTop: 3}}>Register</Button>
                                    <Link href="/login" variant="body2">Already have an Account? Sign in Here!</Link>
                                </Stack>
                            </form>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}

export default Register