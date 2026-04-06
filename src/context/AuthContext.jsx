import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const initialized = useRef(false);

  const fetchProfile = async (userId) => {
    // Add a 3s timeout to avoid blocking the app if the DB hangs
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
    );

    try {
      console.log('Auth: Fetching profile for user:', userId);
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Auth: Profile not found (new user)');
          return null;
        }
        console.error('Auth: Profile fetch error:', error);
        return null;
      }
      
      if (data) {
        console.log('Auth: Profile found:', data.name || data.email);
        const enrichedProfile = { 
          ...data, 
          plan: data.plan || 'free',
          is_trial: data.is_trial || false,
          trial_until: data.trial_until || null,
          coupon_applied: data.coupon_applied || null
        };
        setProfile(enrichedProfile);
        return enrichedProfile;
      }
    } catch (err) {
      console.error('Auth: Profile fetch exception:', err.message);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (initialized.current) return;
      console.log('Auth: Starting initialization...');
      
      const timeoutId = setTimeout(() => {
        if (mounted && loading && !initialized.current) {
          console.warn('Auth: Initialization timeout reached (5s).');
          setLoading(false);
          initialized.current = true;
        }
      }, 5000);

      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && !initialized.current) {
          if (initialSession) {
            console.log('Auth: Initial session found:', initialSession.user.email);
            setSession(initialSession);
            setUser(initialSession.user);
            // Non-blocking fetch profile for initialization
            fetchProfile(initialSession.user.id).finally(() => {
              if (mounted && !initialized.current) {
                console.log('Auth: Initialization complete (with profile/attempt)');
                setLoading(false);
                initialized.current = true;
              }
            });
          } else {
            console.log('Auth: No initial session');
            setLoading(false);
            initialized.current = true;
          }
        }
      } catch (err) {
        console.error('Auth: Initial session fetch failed:', err);
        if (mounted) setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth: State change event:', event);
      if (!mounted) return;
      
      const prevUserId = user?.id;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        if (newSession.user.id !== prevUserId) {
          fetchProfile(newSession.user.id);
        }
      } else {
        setProfile(null);
      }

      if (!initialized.current) {
        console.log('Auth: Initialization finished via event');
        setLoading(false);
        initialized.current = true;
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAsDemo = () => {
    const demoUser = { id: 'demo-user', email: 'demo@dabby.ai', user_metadata: { full_name: 'Demo User' } };
    const demoProfile = { id: 'demo-user', name: 'Demo User', plan: 'go' };
    setUser(demoUser);
    setProfile(demoProfile);
    setSession({ user: demoUser });
    setLoading(false);
    initialized.current = true;
  };

  const updateTrialStatus = async (couponCode = null) => {
    if (!user || user.id === 'demo-user') return;
    
    try {
      let updateData = {};
      if (couponCode === 'DABBY7TRIAL') {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        updateData = {
          plan: 'go',
          is_trial: true,
          trial_until: sevenDaysFromNow.toISOString(),
          coupon_applied: couponCode
        };
      } else if (!couponCode) {
        // Generic trial start (e.g. surprise bonus)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        updateData = {
          plan: 'go',
          is_trial: true,
          trial_until: sevenDaysFromNow.toISOString()
        };
      }

      if (Object.keys(updateData).length > 0) {
        const updatedProfile = await dbService.updateProfile(user.id, updateData);
        setProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (err) {
      console.error('Auth: Update trial status failed:', err);
      throw err;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    loginAsDemo,
    updateTrialStatus,
    refreshProfile: () => user && user.id !== 'demo-user' ? fetchProfile(user.id) : null,
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      initialized.current = false;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
