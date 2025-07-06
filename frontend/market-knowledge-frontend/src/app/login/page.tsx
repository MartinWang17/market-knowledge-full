'use client';
import { useState } from 'react';
import { supabase } from "@/app/supabaseClient";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        let result;
        if (isLogin) {
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
            result = await supabase.auth.signUp({ email, password });
        }
        if (result.error) {
            setMessage("❌" + result.error.message);
        } else {
            setMessage(`✅ Success! ${!isLogin ? "Check your inbox" : "You're logged in"}`) // how do I add the else statement
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">
                {isLogin ? "Login" : "Sign Up"}
            </h2>
            <input
                className="border p-2 w-full mb-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button 
                onClick={handleSubmit}
                className="bg-blue-600 text-white p-2 w-full">
                {isLogin ? "Login" : "Sign Up"}
            </button>
            <button
                className="text-sm mt-4 text-center cursor-pointer" 
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? "Sign up" : "Login"}
            </button>
            {message && <p className="mt-2 text-center">{message}</p>}
        </div>
    )

}