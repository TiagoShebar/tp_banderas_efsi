import Link from "next/link";

const NavBar = () => {
    return(
        <>
        <nav>
        <Link href="/">Game</Link>
        <Link href="/HighScores">HighScores</Link>
        </nav>
        </>
    );
}

export default NavBar