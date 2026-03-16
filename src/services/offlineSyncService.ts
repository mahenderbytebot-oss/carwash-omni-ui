/**
 * Offline Sync Service
 * 
 * Manages caching and offline queueing for the Cleaner Dashboard.
 */

import { type WashAssignment } from './cleanerDashboardService';
import { updateWashStatus } from './cleanerDashboardService';

const DB_NAME = 'CarWashCleanerDB';
const DB_VERSION = 1;

// Object store names
const STORE_CACHE = 'assignments_cache';
const STORE_SYNC = 'sync_queue';

interface SyncQueueItem {
  id: number; // washId
  status: 'IN_PROGRESS' | 'COMPLETED' | 'VEHICLE_NOT_AVAILABLE';
  notes?: string;
  photos?: File[];
  timestamp: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Store for caching the latest GET request for assigned washes
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE, { keyPath: 'id' });
      }

      // Store for queuing offline updates (PUT requests)
      if (!db.objectStoreNames.contains(STORE_SYNC)) {
        db.createObjectStore(STORE_SYNC, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Cache an array of assignments replacing the old cache
 */
export const cacheAssignments = async (assignments: WashAssignment[]): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_CACHE, 'readwrite');
    const store = transaction.objectStore(STORE_CACHE);

    store.clear(); // Clear old cache first
    assignments.forEach(assignment => store.put(assignment));

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to cache assignments', err);
  }
};

/**
 * Retrieve cached assignments
 */
export const getCachedAssignments = async (): Promise<WashAssignment[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_CACHE, 'readonly');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get cached assignments', err);
    return [];
  }
};

/**
 * Perform a partial update of a cached assignment (e.g. optimistic UI update)
 */
export const updateCachedAssignmentStatus = async (
  washId: number, 
  status: WashAssignment['status'],
  notes?: string
): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_CACHE, 'readwrite');
    const store = transaction.objectStore(STORE_CACHE);
    const getRequest = store.get(washId);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const assignment = getRequest.result as WashAssignment;
        if (assignment) {
          assignment.status = status;
          if (notes !== undefined) {
             assignment.notes = notes;
          }
          store.put(assignment);
        }
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to update cached assignment', err);
  }
};


/**
 * Add a wash status update to the offline sync queue
 */
export const addToSyncQueue = async (
  washId: number,
  status: SyncQueueItem['status'],
  notes?: string,
  photos?: File[]
): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_SYNC, 'readwrite');
    const store = transaction.objectStore(STORE_SYNC);

    const item: SyncQueueItem = {
      id: washId,
      status,
      notes,
      photos,
      timestamp: Date.now()
    };

    store.put(item); // overwrite if an update for this wash already exists in queue

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to add to sync queue', err);
  }
};

/**
 * Processes the queue by retrying failed status updates
 */
export const processSyncQueue = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_SYNC, 'readonly');
    const store = transaction.objectStore(STORE_SYNC);
    const request = store.getAll();

    const queuedItems: SyncQueueItem[] = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (queuedItems.length === 0) return;

    for (const item of queuedItems) {
      try {
        await updateWashStatus(item.id, item.status, item.notes, item.photos);
        // If successful, remove from queue
        await removeFromSyncQueue(item.id);
      } catch (err) {
         console.warn(`[Sync] Failed to process queued update for wash ${item.id}`, err);
         // Leave it in the queue for the next retry
      }
    }
  } catch (err) {
    console.error('Failed to process sync queue', err);
  }
};

/**
 * Remove an item from the sync queue
 */
const removeFromSyncQueue = async (washId: number): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_SYNC, 'readwrite');
    const store = transaction.objectStore(STORE_SYNC);
    store.delete(washId);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to remove from sync queue', err);
  }
};
