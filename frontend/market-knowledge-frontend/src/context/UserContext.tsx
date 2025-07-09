'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/app/supabaseClient';
import type { User } from '@supabase/supabase-js'

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user)
        }
        getUser();
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            listener?.subscription.unsubscribe();
        }
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);