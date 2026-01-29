import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../../types/user';

function Home() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/users/me")
            .then((response) => response.json())
            .then(setUser);
    }, []);

    return (
        <>
            <h1>Home Page</h1>
            

            <Link to="/register">Register</Link>

            <p>
                {user ? `Logged in as ${user.username}` : "Not logged in"}
            </p>
        </>
    )
};


export default Home;