import { useState } from "react"
import api from "../../client/client"

const Register = () => {
    const [username, setUsername] = useState("");

    const create_user = async () => {
        const { data } = await api.post("/users/", {
            username,
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

            <button onClick={create_user}>
                Create User
            </button>
        </>
    )
}

export default Register