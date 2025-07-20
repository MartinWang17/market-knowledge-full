"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "./loadingSpinner";

export default function Navbar() {
    const pathname = usePathname();
    const user = useUser();

    if (user === undefined) {
        // If user is undefined, it means the user data is still being fetched
        return (
            <LoadingSpinner />
        )
    }
    else return (
        <div className="container-fluid pt-2">
        <header className="d-flex justify-content-between align-items-end my-3">
            <ul className="nav nav-pills w-100 d-flex justify-content-between align-items-center mx-3">
                <li className="nav-item ms-1 ms-md-4 ms-lg-5">
                    {/* <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}> */}
                    <Link href="/">
                        <Image
                            src="/market-knowledge-handlogo-transparent.png"
                            alt="Market Knowledge Logo"
                            width={40}
                            height={40}
                            priority
                            style={{ objectFit: "contain" }}
                        />
                        Market-Knowledge
                    </Link>
                </li>
                {/* Far left */}
                <li className="nav-item ms-auto">
                    <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`}>
                    Pricing
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/features" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
                    Features
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/comments" className={`nav-link ${pathname === "/comments" ? "active" : ""}`}>
                    Comments
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/collections" className={`nav-link ${pathname === "/collections" ? "active" : ""}`}>
                    Collections
                    </Link>
                </li>
                {/* Far right */}
                <li className="nav-item ms-auto me-1 me-md-4 me-lg-5">
                    <Link href="/login" className={"nav-link login-link"}>
                    {/* {user ? "Profile" : "Login"} */}
                    Profile
                    </Link>
                </li>
            </ul>
        </header>
        </div>
    );
}