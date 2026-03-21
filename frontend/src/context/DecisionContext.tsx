'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DecisionOption {
  label: string;
  description: string;
}

export interface Outcome {
  type: 'best' | 'worst' | 'expected';
  probability: number;
  description: string;
  financialImpact: string;
}

export interface SimulationResult {
  optionLabel: string;
  risk: 'High' | 'Medium' | 'Low';
  growth: string;
  outcomes: Outcome[];
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  category: string;
  options: DecisionOption[];
  horizon: number;
  createdAt: string;
  status: 'pending' | 'simulated';
  confidence: number;
  results?: SimulationResult[];
}

interface DecisionContextType {
  decisions: Decision[];
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'status' | 'confidence'>) => Decision;
  getDecision: (id: string) => Decision | undefined;
  deleteDecision: (id: string) => void;
  simulateDecision: (id: string) => void;
}

const DecisionContext = createContext<DecisionContextType | null>(null);

const CATEGORIES = ['Career', 'Finance', 'Education', 'Relocation', 'Health', 'Relationships'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function generateSimulation(decision: Decision): SimulationResult[] {
  return decision.options.map((opt, i) => {
    const isFirst = i === 0;
    return {
      optionLabel: opt.label || opt.description.slice(0, 30),
      risk: isFirst ? 'High' : (i === 1 ? 'Low' : 'Medium'),
      growth: isFirst ? `+${60 + Math.floor(Math.random() * 80)}%` : `+${10 + Math.floor(Math.random() * 30)}%`,
      outcomes: [
        {
          type: 'best' as const,
          probability: 30 + Math.floor(Math.random() * 25),
          description: `${opt.description} succeeds beyond expectations. Strong upside potential realized.`,
          financialImpact: `+$${(200 + Math.floor(Math.random() * 600))}k`,
        },
        {
          type: 'expected' as const,
          probability: 40 + Math.floor(Math.random() * 20),
          description: `${opt.description} proceeds as planned with moderate gains.`,
          financialImpact: `+$${(50 + Math.floor(Math.random() * 150))}k`,
        },
        {
          type: 'worst' as const,
          probability: 10 + Math.floor(Math.random() * 20),
          description: `${opt.description} doesn't work out. Need to find alternatives.`,
          financialImpact: `-$${(20 + Math.floor(Math.random() * 80))}k`,
        },
      ],
    };
  });
}

const SAMPLE_DECISIONS: Decision[] = [
  {
    id: 'sample-1',
    title: 'Should I switch to an AI engineering role at a startup?',
    context: 'Currently at a stable FAANG company. Got an offer from an AI startup with equity.',
    category: 'Career',
    options: [
      { label: 'Take the Startup Role', description: 'Join the AI startup with equity package' },
      { label: 'Stay at Current Job', description: 'Continue stable career path at FAANG' },
    ],
    horizon: 5,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'simulated',
    confidence: 82,
    results: [
      {
        optionLabel: 'Take the Startup Role',
        risk: 'High',
        growth: '+120%',
        outcomes: [
          { type: 'best', probability: 45, description: 'Startup succeeds. Equity becomes very valuable. Leading the AI team.', financialImpact: '+$800k' },
          { type: 'expected', probability: 25, description: 'Startup does okay. Good experience but equity worth less than expected.', financialImpact: '+$120k' },
          { type: 'worst', probability: 30, description: 'Startup runs out of funding in 18 months. Need to find a new job.', financialImpact: '-$50k' },
        ],
      },
      {
        optionLabel: 'Stay at Current Job',
        risk: 'Low',
        growth: '+20%',
        outcomes: [
          { type: 'best', probability: 15, description: 'Get promoted twice. Lead a major project.', financialImpact: '+$250k' },
          { type: 'expected', probability: 85, description: 'Steady promotions, consistent salary bumps.', financialImpact: '+$150k' },
          { type: 'worst', probability: 5, description: 'Company has layoffs, position is affected.', financialImpact: '-$30k' },
        ],
      },
    ],
  },
  {
    id: 'sample-2',
    title: 'Relocate to Berlin for remote work & lower cost of living?',
    context: 'My company allows full remote. Berlin has a great tech scene and lower rent.',
    category: 'Relocation',
    options: [
      { label: 'Move to Berlin', description: 'Relocate to Berlin, keep remote job' },
      { label: 'Stay in SF', description: 'Stay in San Francisco, high cost but strong network' },
    ],
    horizon: 3,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'simulated',
    confidence: 74,
    results: [
      {
        optionLabel: 'Move to Berlin',
        risk: 'Medium',
        growth: '+45%',
        outcomes: [
          { type: 'best', probability: 35, description: 'Love the new lifestyle, save significantly, expand international network.', financialImpact: '+$180k' },
          { type: 'expected', probability: 45, description: 'Enjoy the experience but miss SF network. Moderate savings.', financialImpact: '+$90k' },
          { type: 'worst', probability: 20, description: 'Struggle with the move, feel isolated, return after a year.', financialImpact: '-$25k' },
        ],
      },
      {
        optionLabel: 'Stay in SF',
        risk: 'Low',
        growth: '+15%',
        outcomes: [
          { type: 'best', probability: 20, description: 'Network leads to amazing new opportunity.', financialImpact: '+$200k' },
          { type: 'expected', probability: 70, description: 'Continue current lifestyle, slow savings growth.', financialImpact: '+$50k' },
          { type: 'worst', probability: 10, description: 'Rent increases eat into savings.', financialImpact: '-$15k' },
        ],
      },
    ],
  },
  {
    id: 'sample-3',
    title: 'Pursue a Master\'s in Machine Learning part-time?',
    context: 'Georgia Tech OMSCS program. Can do it while working but it will be intense for 2 years.',
    category: 'Education',
    options: [
      { label: 'Enroll in OMSCS', description: 'Start the part-time Master\'s program' },
      { label: 'Self-study & Certifications', description: 'Continue learning through online courses and certs' },
    ],
    horizon: 3,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'pending',
    confidence: 0,
  },
];

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('decisions');
    if (stored) {
      try {
        setDecisions(JSON.parse(stored));
      } catch {
        setDecisions(SAMPLE_DECISIONS);
        localStorage.setItem('decisions', JSON.stringify(SAMPLE_DECISIONS));
      }
    } else {
      setDecisions(SAMPLE_DECISIONS);
      localStorage.setItem('decisions', JSON.stringify(SAMPLE_DECISIONS));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('decisions', JSON.stringify(decisions));
    }
  }, [decisions, loaded]);

  const addDecision = (data: Omit<Decision, 'id' | 'createdAt' | 'status' | 'confidence'>): Decision => {
    const newDecision: Decision = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      confidence: 0,
      category: data.category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    };
    setDecisions(prev => [newDecision, ...prev]);
    return newDecision;
  };

  const getDecision = (id: string) => decisions.find(d => d.id === id);

  const deleteDecision = (id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  const simulateDecision = (id: string) => {
    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'simulated' as const,
          confidence: 65 + Math.floor(Math.random() * 25),
          results: generateSimulation(d),
        };
      }
      return d;
    }));
  };

  return (
    <DecisionContext.Provider value={{ decisions, addDecision, getDecision, deleteDecision, simulateDecision }}>
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecisions() {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error('useDecisions must be used within DecisionProvider');
  return ctx;
}
