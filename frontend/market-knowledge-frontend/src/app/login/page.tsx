'use client';
import { useState, useEffect } from 'react';
import { supabase } from "@/app/supabaseClient";
import { useUser } from "@/context/UserContext"

export default function AuthForm() {
    const user = useUser()
    const [tier, setTier] = useState("free");
    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            const { data } = await supabase
                .from("user_profiles")
                .select("tier")
                .eq("user_id", user.id)
                .single();
            if (data) setTier(data.tier);
            })();
        }, [user?.id]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");
    const [showReset, setShowReset] = useState(false);

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
            // if sign up is successful, create user profile
            if (!result.error && result.data?.user) {
                const userId = result.data.user.id;
                // Check if user already exists in user_profiles
                const { data: existing, error: profileError } = await supabase
                    .from("user_profiles")
                    .select("user_id")
                    .eq("user_id", userId)
                    .single();

                if (!existing) {
                await supabase.from("user_profiles").insert([
                    { user_id: userId, tier: "free" }
                ]);
                }
            }
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

    const handleResetPassword = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            setMessage("❌ " + error.message);
        } else {
            setMessage("✅ Check your email for password reset instructions.");
        }
    }

    return (

    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm p-4" style={{ minWidth: 340, maxWidth: 380 }}>
            {user && user.email ? (
                <div className="text-center">
                    <span className="fw-bold" style={{ color: '#1E555C' }}>Signed in as</span>
                    <div className="fs-5 mt-1 mb-2">{user.email}</div>
                    <div className="fw-bold mb-2">Tier: {tier}</div>
                    <button 
                        onClick={logOut}
                        className="btn btn-outline-danger w-100 mt-2">
                        Log Out
                    </button>
                </div>
            ) : showReset ? (
                    // --- NEW: Reset Password Form ---
                    <>
                        <h2 className="mb-3 text-center fw-bold">Reset Password</h2>
                        <form onSubmit={handleResetPassword} className="mb-2">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-2">
                                Send Reset Link
                            </button>
                        </form>
                        <button
                            className="btn btn-link w-100"
                            style={{ textDecoration: "none" }}
                            onClick={() => {
                                setShowReset(false);
                                setMessage("");
                            }}>
                            Back to Login
                        </button>
                        {message && <div className="alert alert-info text-center py-2 my-2">{message}</div>}
                    </>
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
                                <div className="input-group" style={{ border: "none" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={0}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </span>
                                </div>
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
                        <button 
                            type="button"
                            className="btn btn-link w-100"
                            onClick={() => setShowReset(true)}
                            style={{ textDecoration: "none", color: "red", border: "none" }}
                            >
                            Forgot Password?
                        </button>
                        {message && <div className="alert alert-info text-center py-2 my-2">{message}</div>}
                    </>
            )}
        </div>
    </div>

    )

}