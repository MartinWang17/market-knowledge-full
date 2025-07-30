'use client';
import { useState, useEffect } from 'react';
import { supabase } from "@/app/supabaseClient";
import { useUser } from "@/context/UserContext";

type Plan = {
  key: string;
  name: string;
  price: string;
  features: string[];
  highlight: boolean;
  priceId: string;
}

const PLANS = [
    {
        key: 'free',
        name: 'Free',
        price: '$0',
        features: [
            'Store up to 500 comments',
            'Export comments as CSV',
            'Unlimited scrape requests',
        ],
        highlight: false,
        priceId: 'None'
    },
    {
        key: 'pro',
        name: 'Pro',
        price: '$1',
        features: [
            'Everything in Free',
            'Store up to 5,000 comments',
            '(Just to cover database costs)',
        ],
        highlight: true,
        priceId: 'price_1RqFugATd798WEM4dS6aIBdT'
    },
    {
        key: 'max',
        name: 'Max',
        price: '$10',
        features: [
            'Everything in Pro',
            'Store up to 100,000 comments',
            '(Again just to cover database costs)',
        ],
        highlight: false,
        priceId: 'price_1RqFvAATd798WEM4mp0G1EDu'
    }
];

export default function PricingPage() {
    const user = useUser();
    const [tier, setTier] = useState("free");
    const [message, setMessage] = useState("");

    const handleBuyPlan = async (plan: Plan) => {
      if (!user?.id) {
        setMessage("Please log in to purchase.");
        return;
      }
      setMessage("Redirecting to payment...");
      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId: plan.priceId, userId: user.id }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location = data.url; // Redirect to Stripe Checkout
        } else {
          setMessage("❌ Payment error: " + (data.error || "Unknown error"));
        }
      } catch (e) {
        setMessage("❌ Network error: " + (e as Error).message);
      }
    };

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

    // const handleTierChange = async (tier: string) => {
    //     if (!user?.id) {
    //         setMessage("Please log in to change your tier.");
    //         return;
    //     }
    //     const { error } = await supabase
    //         .from("user_profiles")
    //         .update({ tier })
    //         .eq("user_id", user.id);
    //     console.log("Trying to set tier:", tier, "for user:", user.id);

    //     if (error) {
    //         setMessage("❌ " + error.message);
    //     } else {
    //         setTier(tier);
    //         setMessage(`✅ Tier changed to ${tier}`);
    //     }
    // }

    return (
        <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    //   background: "linear-gradient(135deg,#f5f6fa 0%,#f1f1ff 100%)"
    }}>
      <h1 style={{ fontSize: "2.4rem", margin: "2rem 0 0.5rem 0", fontWeight: 700 }}>Choose Your Plan</h1>
      <div style={{
        display: "flex",
        gap: "2rem",
        marginTop: "2rem",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <span className="blue-light" style={{ zIndex: 10, left: "-800px", bottom: "300px" }}></span>
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: plan.highlight
                ? "0 10px 30px rgba(88,78,255,0.14)"
                : "0 4px 20px rgba(60,60,100,0.10)",
              border: plan.highlight
                ? "2.5px solid #1E555C"
                : "1.5px solid #e4e4e7",
              minWidth: 260,
              maxWidth: 300,
              padding: "2rem 2.2rem 2.5rem 2.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: plan.highlight ? "scale(1.07)" : "scale(1)",
              zIndex: plan.highlight ? 1 : 0,
              transition: "all 0.2s"
            }}
          >
            <span style={{
              fontWeight: 700,
              color: plan.highlight ? "#1E555C" : "#555",
              fontSize: "1.3rem",
              marginBottom: 8,
              letterSpacing: "0.04em"
            }}>{plan.name}</span>
            <span style={{
              fontWeight: 900,
              fontSize: "2.5rem",
              margin: "0.5rem 0",
              color: plan.highlight ? "#1E555C" : "#2c2c2c"
            }}>{plan.price}
              <span style={{ fontWeight: 400, fontSize: "1.1rem", color: "#888" }}></span>
            </span>
            <ul style={{
              padding: 0,
              margin: "1.2rem 0 2rem 0",
              listStyle: "none",
              textAlign: "left",
              color: "#333",
              fontSize: "1rem"
            }}>
              {plan.features.map(f =>
                <li key={f} style={{ marginBottom: 7, display: "flex", alignItems: "center" }}>
                  <span style={{
                    display: "inline-block",
                    width: 6, height: 6, borderRadius: 6, background: plan.highlight ? "#1E555C" : "#bbb", marginRight: 10
                  }}></span>
                  {f}
                </li>
              )}
            </ul>
            <button
              onClick={() => handleBuyPlan(plan)}
              style={{
                background: plan.highlight ? "#285280" : "#f1f1f8",
                color: plan.highlight ? "#fff" : "#285280",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                fontSize: "1.08rem",
                padding: "0.8rem 2rem",
                boxShadow: plan.highlight ? "0 3px 12px rgba(88,78,255,0.13)" : "none",
                cursor: tier === plan.key ? "default" : "pointer",
                opacity: tier === plan.key ? 0.6 : 1,
                marginTop: "auto",
                transition: "all 0.15s"
              }}
              disabled={tier === plan.key || (plan.key === 'free' && tier !== "free")} // Disable free is user is not on free
            >
              {tier === plan.key 
                ? "Current Plan" 
                : plan.key === "free" && tier !== "free"
                ? "No need to downgrade"
                : "Select Plan"}
            </button>
          </div>
        ))}
      </div>
      {tier && (
        <div style={{ marginTop: "2.5rem", fontWeight: 500, color: "#222" }}>
          <strong>Your current tier:</strong> {tier}
        </div>
      )}
      {message && (
        <div style={{ marginTop: "1rem", color: "#285280" }}>{message}</div>
      )}
    </div>
    );
}