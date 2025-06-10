"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className="container">
        {" "}
        <header className="d-flex justify-content-center py-3">
            {" "}
            <ul className="nav nav-pills">
            {" "}
            <li className="nav-item">
                <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                Home
                </Link>
            </li>{" "}
            <li className="nav-item">
                <a href="#" className={`nav-link ${pathname === "/how-to-use" ? "active" : ""}`}>
                How-To-Use
                </a>
            </li>{" "}
            <li className="nav-item">
                <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`}>
                Pricing
                </Link>
            </li>{" "}
            <li className="nav-item">
                <Link href="/comments" className={`nav-link ${pathname === "/comments" ? "active" : ""}`}>
                My Comments
                </Link>
            </li>{" "}
            <li className="nav-item">
                <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
                About
                </Link>
            </li>{" "}
            </ul>{" "}
        </header>{" "}
        </div>
    );
}