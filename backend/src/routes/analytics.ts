import { Router } from 'express';
import { db } from '../db';
import { decisions, scenarios, timelineEvents } from '../db/schema';
import { sql, eq } from 'drizzle-orm';

const router = Router();

// Get basic stats for a user
router.get('/:userId/stats', async (req, res) => {
    try {
        const userId = req.params.userId;

        const [totalDecisions] = await db.select({
            count: sql<number>`count(*)::int`
        }).from(decisions).where(eq(decisions.userId, userId));

        const [pendingDecisions] = await db.select({
            count: sql<number>`count(*)::int`
        }).from(decisions)
        .where(sql`${decisions.userId} = ${userId} AND ${decisions.status} = 'pending'`);

        res.json({
            totalDecisions: totalDecisions.count,
            pendingDecisions: pendingDecisions.count,
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
