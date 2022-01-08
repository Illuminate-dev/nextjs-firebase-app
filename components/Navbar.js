import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";


// Top Navbar
export default function Navbar() {
    const {user, username} = useContext(UserContext)

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href = "/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {username && (
                    <>
                        <li>
                            <Link href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} alt=""/>
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}