import Dexie from 'dexie';

export const db = new Dexie('ElMohasibDatabase');

// Define the local schema
// `id` is primary key. ++ means auto-increment for local-only records.
// `sync_status` can be 'synced', 'pending_create', 'pending_update', 'pending_delete'
db.version(2).stores({
  products: 'id, name, barcode, category_id, business_id, sync_status',
  customers: 'id, name, phone, business_id, sync_status',
  settings: 'key, value, business_id', // Setting key as primary
  categories: 'id, name, business_id, sync_status',
  suppliers: 'id, name, phone, business_id, sync_status',
  purchases: 'id, purchase_number, business_id, supplier_id, sync_status',
  outbox: '++local_id, type, payload, created_at, status' // Queue for outgoing requests
});

export default db;
