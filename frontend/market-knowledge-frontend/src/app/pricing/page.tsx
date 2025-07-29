'use client';
import { useState, useEffect } from 'react';
import { supabase } from "@/app/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function PricingPage() {
    const user = useUser();
    const [tier, setTier] = useState("free");
    const [message, setMessage] = useState("");

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

    const handleTierChange = async (tier: string) => {
        if (!user?.id) {
            setMessage("Please log in to change your tier.");
            return;
        }
        const { error } = await supabase
            .from("user_profiles")
            .update({ tier })
            .eq("user_id", user.id);
        console.log("Trying to set tier:", tier, "for user:", user.id);

        if (error) {
            setMessage("❌ " + error.message);
        } else {
            setTier(tier);
            setMessage(`✅ Tier changed to ${tier}`);
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
      <h1>Choose Your Plan</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={() => handleTierChange("free")}
          style={{
            padding: "1rem",
            background: tier === "free" ? "#e0f7fa" : "#f4f4f4",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          Free
        </button>
        <button
          onClick={() => handleTierChange("pro")}
          style={{
            padding: "1rem",
            background: tier === "pro" ? "#fff3e0" : "#f4f4f4",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          Pro
        </button>
        <button
          onClick={() => handleTierChange("max")}
          style={{
            padding: "1rem",
            background: tier === "max" ? "#f3e5f5" : "#f4f4f4",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          Max
        </button>
      </div>
      {tier && (
        <div style={{ marginTop: "2rem" }}>
          <strong>Your current tier:</strong> {tier}
        </div>
      )}
      {message && (
        <div style={{ marginTop: "1rem", color: "#1976d2" }}>{message}</div>
      )}
    </div>
    );
}