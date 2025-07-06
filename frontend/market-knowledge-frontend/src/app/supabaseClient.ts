import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY) {
    throw new Error("Missing Supabase environment variables");
}

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!;

export const supabase = createClient(supabaseURL, supabaseKey)