'use client';

import Bookmarks from '@/src/components/Bookmarks';
import Login from '@/src/components/Login';
import { getCurrentUser, loginWithGoogle, logout, supabase } from '@/src/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login loginWithGoogle={loginWithGoogle} />;
  }


  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Bookmarks</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <Bookmarks user={user} />
    </div>
  );
}
