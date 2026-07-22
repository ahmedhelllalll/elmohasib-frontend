import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import db from '../db';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [settings, setSettings] = useState({
        tax_rate: '15',
        business_name: 'المُحاسِب.',
        receipt_footer: 'شكراً لتسوقكم معنا!',
        currency: 'ر.س',
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchSettings = async () => {
        try {
            if (!navigator.onLine) throw new Error("Offline");
            const response = await axios.get('/settings');
            setSettings(response.data);
            
            // Cache to dexie (only one row for settings in local db)
            await db.settings.clear();
            // Store each key-value pair
            const entries = Object.entries(response.data).map(([key, value]) => ({ key, value }));
            await db.settings.bulkAdd(entries);
        } catch (error) {
            console.log("Fetching settings from local database due to network error.");
            try {
                const localSettingsArray = await db.settings.toArray();
                if (localSettingsArray.length > 0) {
                    const localSettings = {};
                    localSettingsArray.forEach(s => localSettings[s.key] = s.value);
                    setSettings(localSettings);
                }
            } catch (dbError) {
                console.error("Local DB Error", dbError);
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchSettings();
        }
    }, [token]);

    const updateSettings = async (newSettings) => {
        setIsLoading(true);
        try {
            await axios.post('/settings', { settings: newSettings });
            setSettings(prev => ({ ...prev, ...newSettings }));
            toast.success("تم تحديث الإعدادات بنجاح");
            return true;
        } catch (error) {
            console.error("Error updating settings", error);
            toast.error("فشل في تحديث الإعدادات");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            isLoading,
            updateSettings,
            fetchSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
