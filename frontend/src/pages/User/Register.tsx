import api from "../../client/client"
import { useNavigate } from "react-router-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const Register = () => {

    const {
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm<RegisterFormInputs>();

    type RegisterFormInputs = {
        username: string;
        password: string;
    }

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {

        const response = await api.post("/users/register", 
            {
                username: data.username,
                password: data.password,
            }
        );

        navigate("/")
    }


    return (
        <>
            <h1>Register</h1>
            
            <form onSubmit={handleSubmit(onSubmit)}>

                <input defaultValue="test" {...register("username")} />
                <input defaultValue="test" {...register("password")} />
                <input type="submit" />

            </form>

        </>
    )
}

export default Register