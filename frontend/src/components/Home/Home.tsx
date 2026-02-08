import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../../types/user';
import api from "../../client/client"
import { Button } from '@mui/material';
import Navbar from '../common/Navbar';

function Home() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {

        const fetchUser = async () => {
            const response = await api.get("/users/me");
            setUser(response.data)
        }
        fetchUser()
    }, []);

    const logout = async() => {
        await api.post("users/logout");
        setUser(null);
    }

    return (
        <>
            <Navbar/>
            <h1>Home Page</h1>
            

            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>

            <Button onClick={logout}>Logout</Button>

            <p>
                {user ? `Logged in as ${user.username}` : "Not logged in"}
            </p>
        </>
    )
};


export default Home;