"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "./loadingSpinner";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const user = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [animatingOut, setAnimatingOut] = useState(false);
    const handleCloseMenu = () => {
        setAnimatingOut(true);
        setTimeout(() => {
            setMenuOpen(false);
            setAnimatingOut(false);
        }, 250); // Match this duration with the CSS animation duration
    }

    if (user === undefined) {
        // If user is undefined, it means the user data is still being fetched
        return (
            <LoadingSpinner />
        )
    }

    const navLinks = [
        // { href: "/", label: "Home" },
        { href: "/pricing", label: "Pricing" },
        { href: "/features", label: "Features" },
        { href: "/comments", label: "Comments" },
        { href: "/collections", label: "Collections" },
        { href: "/login", label: user ? "Profile" : "Login" }
    ]

    return (
        <nav className="navbar-container d-flex align-items-center justify-content-between">
            <div className="container-fluid pt-2">
                <header className="d-flex justify-content-between align-items-end my-3">
                    <ul className="nav nav-pills w-100 d-flex justify-content-between align-items-center mx-3">
                            <li className="nav-item ms-1 ms-md-4 ms-lg-5">
                                {/* Far left */}
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
                            {/* Centered */}
                            <li className="nav-item ms-auto d-none d-lg-block">
                                <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`}>
                                Pricing
                                </Link>
                            </li>
                            <li className="nav-item d-none d-lg-block">
                                <Link href="/features" className={`nav-link ${pathname === "/features" ? "active" : ""}`}>
                                Features
                                </Link>
                            </li>
                            <li className="nav-item d-none d-lg-block">
                                <Link href="/comments" className={`nav-link ${pathname === "/comments" ? "active" : ""}`}>
                                Comments
                                </Link>
                            </li>
                            <li className="nav-item d-none d-lg-block">
                                <Link href="/collections" className={`nav-link ${pathname === "/collections" ? "active" : ""}`}>
                                Collections
                                </Link>
                            </li>
                            {/* Far right */}
                            <li className="nav-item ms-auto me-1 me-md-4 me-lg-5 d-none d-lg-block">
                                <Link href="/login" className={"nav-link login-link"}>
                                {/* {user ? "Profile" : "Login"} */}
                                Profile
                                </Link>
                            </li>
                        </ul>
                </header>
            </div>

            {/* Hamburger Icon for Mobile */}
            <button
                className="navbar-hamburger d-xl-none me-1 me-md-4 me-lg-5"
                aria-label="Open navigation"
                onClick={() => setMenuOpen(true)}
            >
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
            </button>

            {/* Slide-in Menu Modal */}
            {(menuOpen || animatingOut) && (
                <div className="mobile-menu-modal" onClick={() => setMenuOpen(false)}>
                <div 
                    className={`mobile-menu-content ${animatingOut ? "slideOut" : "slideIn"}`}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="mobile-menu-close" onClick={() => handleCloseMenu()}>
                    &times;
                    </button>
                    <ul className="nav flex-column align-items-center">
                    {navLinks.map(({ href, label }) => (
                        <li className="nav-item mb-4" key={href}>
                        <Link
                            href={href}
                            className={`nav-link${pathname === href ? " active" : ""}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            )}

            {/* CSS for nav bar*/}
            <style jsx>{`
                .navbar-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 2rem;
                position: relative;
                }
                .navbar-logo {
                display: flex;
                align-items: center;
                }
                .navbar-links {
                gap: 1.5rem;
                }
                .navbar-hamburger {
                background: none;
                border: none;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 0.3rem;
                cursor: pointer;
                height: 2rem;
                }
                .hamburger-bar {
                width: 28px;
                height: 3px;
                background: #285280;
                border-radius: 2px;
                }
                .mobile-menu-modal {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: rgba(10,22,34,0.75);
                z-index: 9999;
                display: flex;
                justify-content: flex-end;
                animation: fadeIn 0.2s;
                }
                .mobile-menu-content {
                background: #fff;
                width: 80vw;
                max-width: 360px;
                height: 100%;
                padding: 2rem;
                box-shadow: -2px 0 16px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                }
                .mobile-menu-content.slideIn {
                animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                .mobile-menu-content.slideOut {
                animation: slideOut 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                .mobile-menu-close {
                align-self: flex-end;
                background: none;
                border: none;
                font-size: 2rem;
                color: #285280;
                margin-bottom: 2rem;
                }
                @media (min-width: 992px) {
                .navbar-hamburger { display: none; }
                .mobile-menu-modal { display: none; }
                }
                @keyframes fadeIn {
                from { background: rgba(10,22,34,0); }
                to   { background: rgba(10,22,34,0.75); }
                }
                @keyframes slideIn {
                from { transform: translateX(100%); }
                to   { transform: translateX(0); }
                }
                @keyframes slideOut {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
                }
            `}</style>
        </nav>
    );
}