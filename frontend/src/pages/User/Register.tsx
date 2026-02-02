import { useState } from "react"
import api from "../../client/client"

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const create_user = async () => {
        const { data } = await api.post("/users/register", {
            username,
            password
        });

    }


    return (
        <>
            <h1>Register</h1>
            
            <input
                type="text"
                placeholder="enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={create_user}>
                Create User
            </button>
        </>
    )
}

export default Register