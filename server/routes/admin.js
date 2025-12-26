const express = require('express');
const router = express.Router();
const { db, auth } = require('../firebase');

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// GET /api/admin/stats - Real Data
router.get('/stats', async (req, res) => {
    try {
        const [usersSnap, subSnap, invoicesSnap, ticketsSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('users').where('plan', '!=', 'free').get(),
            db.collection('invoices').where('status', '==', 'paid').get(),
            db.collection('tickets').where('status', '==', 'open').get() // Assuming 'open' status for pending issues
        ]);

        const usersCount = usersSnap.size;
        const activeSubs = subSnap.size;

        let totalRevenue = 0;
        invoicesSnap.forEach(doc => {
            const data = doc.data();
            totalRevenue += (data.amount || 0);
        });

        const pendingIssues = ticketsSnap.size;

        res.json({
            users: usersCount.toLocaleString(),
            subscriptions: activeSubs.toLocaleString(),
            revenue: formatCurrency(totalRevenue),
            issues: pendingIssues.toString()
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/admin/activity - Real Data
router.get('/activity', async (req, res) => {
    try {
        // Assuming 'system_logs' is the collection name based on storageService conventions (LOGS_DB)
        // If it doesn't exist yet, this will just return empty list
        const logsSnap = await db.collection('system_logs')
            .orderBy('date', 'desc')
            .limit(10)
            .get();

        const activities = [];
        logsSnap.forEach(doc => {
            const data = doc.data();
            activities.push({
                id: doc.id,
                user: data.adminId || 'System', // or data.userId if available
                action: data.action,
                time: data.date, // Frontend might need to format this
                status: data.severity === 'error' ? 'error' : (data.severity === 'warning' ? 'warning' : 'success')
            });
        });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        // If index is missing for orderBy, it might fail. Fallback to no ordering or client side sort if needed.
        // For now, return empty array on specific error or 500
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

// GET /api/admin/users - Fetch from Firestore
router.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// DELETE /api/admin/users/:id - Delete from Auth and Firestore
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Delete from Firebase Auth
        await auth.deleteUser(id)
            .catch(err => {
                // It's possible user exists in DB but not Auth (or already deleted), so we log and proceed
                console.warn(`Auth deletion failed for ${id}(might not exist): `, err.message);
            });

        // 2. Delete from Firestore
        await db.collection('users').doc(id).delete();

        res.json({ message: `User ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// PUT /api/admin/users/:id - Update User
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // 1. Update Firestore
        await db.collection('users').doc(id).update(updates);

        // 2. Update Firebase Auth (if critical fields changed)
        if (updates.email || updates.name) {
            const authUpdates = {};
            if (updates.email) authUpdates.email = updates.email;
            if (updates.name) authUpdates.displayName = updates.name;

            await auth.updateUser(id, authUpdates)
                .catch(err => console.warn(`Auth update warning for ${id}:`, err.message));
        }

        res.json({ message: `User ${id} updated successfully` });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

module.exports = router;
