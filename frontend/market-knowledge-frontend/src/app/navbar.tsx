"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className="container-fluid py-1">
        <header className="d-flex justify-content-center py-3">
            <ul className="nav nav-pills">
            <li className="nav-item">
                <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                Home
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/tutorial" className={`nav-link ${pathname === "/tutorial" ? "active" : ""}`}>
                Tutorial
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`}>
                Pricing
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
            </ul>
        </header>
        </div>
    );
}