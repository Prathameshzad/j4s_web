'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('selectedProfile');
        const storedChild = localStorage.getItem('selectedChild');
        
        if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            
            if (storedProfile) {
                const profile = JSON.parse(storedProfile);
                setSelectedProfile(profile);
                
                if (profile.role === 'PARENT' && profile.children?.length > 0) {
                    if (storedChild) {
                        setSelectedChild(JSON.parse(storedChild));
                    } else {
                        setSelectedChild(profile.children[0]);
                        localStorage.setItem('selectedChild', JSON.stringify(profile.children[0]));
                    }
                }
            } else if (parsedUser.availableProfiles && parsedUser.availableProfiles.length > 0) {
                const initialProfile = parsedUser.availableProfiles[0];
                setSelectedProfile(initialProfile);
                localStorage.setItem('selectedProfile', JSON.stringify(initialProfile));
                
                if (initialProfile.role === 'PARENT' && initialProfile.children?.length > 0) {
                    setSelectedChild(initialProfile.children[0]);
                    localStorage.setItem('selectedChild', JSON.stringify(initialProfile.children[0]));
                }
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, jwtToken) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (userData.availableProfiles && userData.availableProfiles.length > 0) {
            const initialProfile = userData.availableProfiles[0];
            setSelectedProfile(initialProfile);
            localStorage.setItem('selectedProfile', JSON.stringify(initialProfile));
            
            if (initialProfile.role === 'PARENT' && initialProfile.children?.length > 0) {
                const initialChild = initialProfile.children[0];
                setSelectedChild(initialChild);
                localStorage.setItem('selectedChild', JSON.stringify(initialChild));
            }
        }
        
        router.push('/dashboard');
    };

    const switchProfile = (profile) => {
        setSelectedProfile(profile);
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        
        if (profile.role === 'PARENT' && profile.children?.length > 0) {
            const initialChild = profile.children[0];
            setSelectedChild(initialChild);
            localStorage.setItem('selectedChild', JSON.stringify(initialChild));
        } else {
            setSelectedChild(null);
            localStorage.removeItem('selectedChild');
        }
        
        router.refresh();
    };

    const switchChild = (child) => {
        setSelectedChild(child);
        localStorage.setItem('selectedChild', JSON.stringify(child));
        router.refresh();
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setSelectedProfile(null);
        setSelectedChild(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedProfile');
        localStorage.removeItem('selectedChild');
        router.push('/login');
    };

    const getDisplayName = () => {
        if (!user) return '';
        if (selectedProfile?.role === 'PARENT' && selectedChild) return `${selectedProfile.name} (${selectedChild.name})`;
        if (selectedProfile?.name) return selectedProfile.name;
        return user.name;
    };

    const selectedRole = selectedProfile?.role || null;
    const selectedUserId = (selectedRole === 'PARENT' && selectedChild) ? selectedChild.userId : (selectedProfile?.userId || null);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            selectedRole, 
            selectedUserId, 
            selectedProfile, 
            selectedChild,
            switchProfile, 
            switchChild,
            login, 
            logout, 
            loading, 
            displayName: getDisplayName() 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
