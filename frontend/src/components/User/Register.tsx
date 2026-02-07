import api from "../../client/client"
import { useNavigate } from "react-router-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Card, CardContent, Grid, Stack, TextField, Typography, Box, Button, Link, Alert } from "@mui/material";

const Register = () => {

    const {
        register, 
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        reValidateMode: "onSubmit"
    });

    type RegisterFormInputs = {
        email: string;
        username: string;
        password: string;
    }

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {

        try {
            await api.post("/users/register", 
                {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                }
            );

            navigate("/")
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError("root", {
                    type: "server",
                    message: "Email Already in use",
                })
            } else if (err.response?.status === 500) {
                setError("root", {
                    type: "server",
                    message: "Something went wrong. Try again later",
                })
            } else {
                for (let val of err.response.data.detail) {
                    let input_field = val.loc[1]
                    let error_message = val.msg

                    setError(input_field, {
                    type: "server",
                    message: error_message,
                })
                }
            }
        }
        
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
                        minHeight: 500,
                        maxHeight: 700,
                        width: '100%',
                        height: 'auto',
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
                                    {errors.email && (
                                        <Alert severity="error" sx={{width: "73%"}}>
                                            {errors.email.message}
                                        </Alert>
                                    )}
                                    <TextField label="Username" variant="filled" required={true} {...register("username")} sx={{width: '80%'}} />
                                    {errors.username && (
                                        <Alert severity="error" sx={{width: "73%"}}>
                                            {errors.username.message}
                                        </Alert>
                                    )}
                                    <TextField label="password" variant="filled" required={true} type="password" {...register("password")} sx={{width: '80%'}} />
                                    {errors.password && (
                                        <Alert severity="error" sx={{width: "73%"}}>
                                            {errors.password.message}
                                        </Alert>
                                    )}
                                    {errors.root && (
                                        <Alert severity="error" sx={{width: "73%"}}>
                                            {errors.root.message}
                                        </Alert>
                                    )}
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