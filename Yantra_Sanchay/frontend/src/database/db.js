import Dexie from 'dexie';

export const db = new Dexie('YantraSanchayDB');

db.version(1).stores({
    users: '++id, email',
    machinery: '++id, ownerId, category',
    requests: '++id, farmerId, providerId, status',
    pooling: '++id, createdBy, status',
    syncQueue: '++id, action, timestamp',
    assessments: '++id, farmerId, timestamp',
});

export const syncQueue = {
    add: async (action, data, endpoint) => {
        try {
            await db.syncQueue.add({
                action,
                data,
                endpoint,
                timestamp: new Date(),
                status: 'pending',
            });
        } catch (error) {
            console.error('Error adding to sync queue:', error);
        }
    },

    getAll: async () => {
        try {
            return await db.syncQueue.where('status').equals('pending').toArray();
        } catch (error) {
            console.error('Error getting sync queue:', error);
            return [];
        }
    },

    markCompleted: async (id) => {
        try {
            await db.syncQueue.update(id, { status: 'completed' });
        } catch (error) {
            console.error('Error marking sync as completed:', error);
        }
    },

    remove: async (id) => {
        try {
            await db.syncQueue.delete(id);
        } catch (error) {
            console.error('Error removing from sync queue:', error);
        }
    },
};

export const offlineStorage = {
    saveMachinery: async (machinery) => {
        try {
            await db.machinery.put(machinery);
        } catch (error) {
            console.error('Error saving machinery to offline storage:', error);
        }
    },

    getMachinery: async (id) => {
        try {
            return await db.machinery.get(id);
        } catch (error) {
            console.error('Error getting machinery from offline storage:', error);
            return null;
        }
    },

    getAllMachinery: async () => {
        try {
            return await db.machinery.toArray();
        } catch (error) {
            console.error('Error getting all machinery from offline storage:', error);
            return [];
        }
    },

    saveRequest: async (request) => {
        try {
            await db.requests.put(request);
        } catch (error) {
            console.error('Error saving request to offline storage:', error);
        }
    },

    getRequests: async () => {
        try {
            return await db.requests.toArray();
        } catch (error) {
            console.error('Error getting requests from offline storage:', error);
            return [];
        }
    },
};
