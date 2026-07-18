import { useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import db from '../db';
import { InventoryContext } from '../context/InventoryContext';

const SyncEngine = () => {
    const { refreshData } = useContext(InventoryContext);

    useEffect(() => {
        const syncOutbox = async () => {
            if (!navigator.onLine) return;

            const pendingItems = await db.outbox.where('status').equals('pending').toArray();
            
            if (pendingItems.length === 0) return;

            toast.info(`جاري مزامنة ${pendingItems.length} عمليات...`);

            let successCount = 0;
            let shouldRefresh = false;

            for (const item of pendingItems) {
                try {
                    if (item.type === 'checkout') {
                        await axios.post('/checkout', item.payload);
                        await db.outbox.update(item.local_id, { status: 'synced' });
                        successCount++;
                        shouldRefresh = true;
                    } else if (item.type === 'create_purchase') {
                        await axios.post('/purchases', item.payload);
                        await db.outbox.update(item.local_id, { status: 'synced' });
                        successCount++;
                        shouldRefresh = true;
                    }
                } catch (error) {
                    console.error("Sync error for item", item, error);
                    // If it's a 422, it might be stock error. Mark as failed.
                    if (error.response && error.response.status === 422) {
                        await db.outbox.update(item.local_id, { status: 'failed', error: error.response.data.message });
                        toast.error(`فشلت مزامنة عملية سابقة: ${error.response.data.message}`);
                    }
                }
            }

            if (successCount > 0) {
                toast.success(`تمت المزامنة بنجاح (${successCount})`);
                // Clear synced items to save space
                await db.outbox.where('status').equals('synced').delete();
            }

            if (shouldRefresh && refreshData) {
                refreshData();
            }
        };

        const handleOnline = () => {
            syncOutbox();
        };

        window.addEventListener('online', handleOnline);
        
        // Also try to sync on mount if online
        if (navigator.onLine) {
            syncOutbox();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, [refreshData]);

    return null; // This component does not render anything
};

export default SyncEngine;
