'use client';
import { useState } from 'react';
import { supabase } from "@/app/supabaseClient";
import { useUser } from "@/context/UserContext"

export default function AuthForm() {
    const user = useUser()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setMessage("❌ Passwords do not match");
            return;
        }
        setMessage(isLogin ? "Logging in..." : "Signing up...");
        let result;
        if (isLogin) {
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
            result = await supabase.auth.signUp({ email, password });
        }
        if (result.error) {
            setMessage("❌ " + result.error.message);
        } else {
            setMessage(`✅ Success! ${!isLogin ? "Check your inbox" : "You're logged in"}`)
        }
    };

    const logOut = async () => {
        let result;
        result = await supabase.auth.signOut();
    }

    return (

    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm p-4" style={{ minWidth: 340, maxWidth: 380 }}>
            {user && user.email ? (
                <div className="text-center">
                    <span className="fw-bold" style={{ color: '#1E555C' }}>Signed in as</span>
                    <div className="fs-5 mt-1 mb-2">{user.email}</div>
                    <button 
                        onClick={logOut}
                        className="btn btn-outline-danger w-100 mt-2">
                        Log Out
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="mb-3 text-center fw-bold" style={{ letterSpacing: '.5px' }}>
                        {isLogin ? "Log In" : "Sign Up"}
                    </h2>
                    <form onSubmit={handleSubmit} className="mb-2">
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                            {!isLogin && 
                            <div className="mb-3">
                                <input 
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                            }  
                        <button type="submit" 
                            className="btn btn-primary w-100 mb-2"
                            style={{ backgroundColor: "#1E555C", color: "#fff", border: "none"}}
                            >
                            {isLogin ? "Sign In" : "Sign Up"}
                        </button>
                    </form>
                    <button
                        type="button"
                        className="btn btn-link w-100 mb-1"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ textDecoration: "none", backgroundColor: "#3599a690", color: "#fff", border: "none" }}
                    >
                        {isLogin ? "Create an account" : "Have an account? Sign in"}
                    </button>
                    {message && <div className="alert alert-info text-center py-2 my-2">{message}</div>}
                </>
            )}
        </div>
    </div>

    )

}