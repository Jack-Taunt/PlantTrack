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
            });
        console.log("TEST")
        
        navigate("/")

    };

    return (
        <>
            <h1>Login</h1>
                
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <input defaultValue="test" {...register("username")} />
                <input defaultValue="test" {...register("password")} />
                <input type="submit" />

            </form>
        </>
    )
}

export default Login