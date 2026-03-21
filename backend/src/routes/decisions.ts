import { Router } from 'express';
import { db } from '../db';
import { decisions, timelineEvents, scenarios } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Create Decision
router.post('/', async (req, res) => {
    try {
        const { userId, title, context } = req.body;
        
        // Ensure userId is present (In a real app, this comes from auth token)
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const [newDecision] = await db.insert(decisions).values({
            userId,
            title,
            context
        }).returning();

        // Create an initial timeline event
        await db.insert(timelineEvents).values({
            decisionId: newDecision.id,
            title: 'Decision Created',
            date: new Date(),
            description: `Started thinking about: ${title}`
        });

        // Call Python AI Service
        try {
            const aiResponse = await fetch('http://127.0.0.1:8000/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision: title, context: context || '' })
            });

            if (aiResponse.ok) {
                const aiData = await aiResponse.json() as any;
                
                // Save AI scenarios to DB
                await db.insert(scenarios).values([
                    {
                        decisionId: newDecision.id,
                        type: 'best_case',
                        description: aiData.best_case,
                        probability: 'High'
                    },
                    {
                        decisionId: newDecision.id,
                        type: 'worst_case',
                        description: aiData.worst_case,
                        probability: 'Medium'
                    }
                ]);
            } else {
                console.error("AI Service returned error:", await aiResponse.text());
            }
        } catch (aiError) {
            console.error("Failed to reach AI service:", aiError);
        }

        res.status(201).json(newDecision);
    } catch (error) {
        console.error("Error creating decision:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User Decisions
router.get('/user/:userId', async (req, res) => {
    try {
        const userDecisions = await db.select()
            .from(decisions)
            .where(eq(decisions.userId, req.params.userId))
            .orderBy(desc(decisions.createdAt));

        res.json(userDecisions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Decision Details (with Scenarios and Timeline)
router.get('/:id', async (req, res) => {
    try {
        const decisionId = req.params.id;
        const [decision] = await db.select().from(decisions).where(eq(decisions.id, decisionId));
        if (!decision) return res.status(404).json({ error: 'Decision not found' });

        const relatedScenarios = await db.select().from(scenarios).where(eq(scenarios.decisionId, decisionId));
        const relatedTimeline = await db.select().from(timelineEvents).where(eq(timelineEvents.decisionId, decisionId)).orderBy(desc(timelineEvents.date));

        res.json({
            ...decision,
            scenarios: relatedScenarios,
            timelineEvents: relatedTimeline
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add Timeline Event
router.post('/:id/timeline', async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const [newEvent] = await db.insert(timelineEvents).values({
            decisionId: req.params.id,
            title,
            date: new Date(date),
            description
        }).returning();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
