'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, ArrowDownRight, Activity, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useDecisions, Decision } from '@/context/DecisionContext';
import styles from './timeline.module.css';

function TimelineContent() {
  const searchParams = useSearchParams();
  const { decisions, simulateDecision } = useDecisions();
  const [activeTab, setActiveTab] = useState('tree');

  const id = searchParams.get('id');
  const simulatedDecisions = decisions.filter(d => d.status === 'simulated');
  const [selectedId, setSelectedId] = useState<string | null>(id || null);

  useEffect(() => {
    if (id) {
      setSelectedId(id);
      const decision = decisions.find(d => d.id === id);
      if (decision && decision.status === 'pending') {
        simulateDecision(id);
      }
    }
  }, [id]);

  const decision = selectedId
    ? decisions.find(d => d.id === selectedId)
    : simulatedDecisions[0];

  if (!decision) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={`glass-panel ${styles.emptyState}`}>
          <Sparkles size={40} />
          <h3>No Simulations Yet</h3>
          <p>Create a decision and run a simulation to see the outcome tree here.</p>
          <Link href="/new-decision" className="btn-primary">Create Decision</Link>
        </div>
      </div>
    );
  }

  const outcomeIcon = (type: string) => {
    switch (type) {
      case 'best': return <ArrowUpRight size={16} />;
      case 'worst': return <ArrowDownRight size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const outcomeClass = (type: string) => {
    switch (type) {
      case 'best': return styles.positiveOutcome;
      case 'worst': return styles.negativeOutcome;
      default: return styles.neutralOutcome;
    }
  };

  const outcomeLabel = (type: string, prob: number) => {
    switch (type) {
      case 'best': return `Best Case (${prob}%)`;
      case 'worst': return `Worst Case (${prob}%)`;
      default: return `Expected (${prob}%)`;
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} /> Back
        </Link>
        <div className={styles.headerContent}>
          <div className={styles.headerMeta}>
            <span className={styles.category}>{decision.category}</span>
            <span className={styles.horizon}>{decision.horizon}Y Horizon</span>
            {decision.confidence > 0 && (
              <span className={styles.confidence}>{decision.confidence}% Confidence</span>
            )}
          </div>
          <h1 className={styles.title}>{decision.title}</h1>
          {decision.context && <p className={styles.subtitle}>{decision.context}</p>}
        </div>

        {simulatedDecisions.length > 1 && (
          <div className={styles.decisionPicker}>
            <select
              className={`input-field ${styles.pickerSelect}`}
              value={selectedId || ''}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {simulatedDecisions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title.length > 40 ? d.title.slice(0, 40) + '...' : d.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Tab Switcher */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'tree' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tree')}
        >
          Outcome Tree
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'compare' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Comparison
        </button>
      </div>

      {activeTab === 'tree' && decision.results ? (
        <div className={styles.treeContainer}>
          {/* Root Node */}
          <div className={styles.rootNodeWrap}>
            <div className={`glass-panel ${styles.rootNode}`}>
              <div className={styles.rootPulse}></div>
              <h3>Current State</h3>
              <p>Your starting point — before the decision.</p>
            </div>
          </div>

          {/* Branch Connector */}
          <div className={styles.trunkLine}></div>
          <div className={styles.branchConnector}>
            <div className={styles.horizontalLine}></div>
          </div>

          {/* Option Branches */}
          <div className={styles.branchesRow}>
            {decision.results.map((result, ri) => (
              <div key={ri} className={styles.branch}>
                <div className={styles.vertLine}></div>
                <div className={`glass-panel ${styles.optionCard}`} style={{ animationDelay: `${ri * 0.15}s` }}>
                  <h4 className={styles.optionTitle}>{result.optionLabel}</h4>
                  <div className={styles.optionStats}>
                    <div className={styles.statLine}>
                      <span className={styles.statKey}>Risk</span>
                      <span className={
                        result.risk === 'High' ? styles.highRisk :
                        result.risk === 'Low' ? styles.lowRisk : styles.medRisk
                      }>{result.risk}</span>
                    </div>
                    <div className={styles.statLine}>
                      <span className={styles.statKey}>Growth</span>
                      <span className={styles.growth}>{result.growth}</span>
                    </div>
                  </div>
                </div>

                {/* Outcome Cards */}
                <div className={styles.outcomes}>
                  {result.outcomes.map((outcome, oi) => (
                    <div key={oi} style={{ animationDelay: `${(ri * 3 + oi) * 0.1}s` }}>
                      <div className={styles.outcomeConnector}></div>
                      <div className={`glass-panel ${styles.outcomeCard} ${outcomeClass(outcome.type)}`}>
                        <div className={styles.outcomeHeader}>
                          {outcomeIcon(outcome.type)}
                          <h5>{outcomeLabel(outcome.type, outcome.probability)}</h5>
                        </div>
                        <p className={styles.outcomeDesc}>{outcome.description}</p>
                        <div className={styles.impactRow}>
                          <span>Financial Impact</span>
                          <span className={styles.impactValue}>{outcome.financialImpact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'compare' && decision.results ? (
        <div className={styles.compareContainer}>
          <div className={`glass-panel ${styles.compareCard}`}>
            <h3>Side-by-Side Comparison</h3>
            <div className={styles.compareGrid}>
              <div className={styles.compareHeader}>
                <div className={styles.compareLabel}>Metric</div>
                {decision.results.map((r, i) => (
                  <div key={i} className={styles.compareLabel}>{r.optionLabel}</div>
                ))}
              </div>
              {/* Risk */}
              <div className={styles.compareRow}>
                <div className={styles.compareMetric}>Risk Level</div>
                {decision.results.map((r, i) => (
                  <div key={i} className={styles.compareValue}>
                    <span className={
                      r.risk === 'High' ? styles.highRisk :
                      r.risk === 'Low' ? styles.lowRisk : styles.medRisk
                    }>{r.risk}</span>
                  </div>
                ))}
              </div>
              {/* Growth */}
              <div className={styles.compareRow}>
                <div className={styles.compareMetric}>Projected Growth</div>
                {decision.results.map((r, i) => (
                  <div key={i} className={styles.compareValue}>
                    <span className={styles.growth}>{r.growth}</span>
                  </div>
                ))}
              </div>
              {/* Best Case */}
              <div className={styles.compareRow}>
                <div className={styles.compareMetric}>Best Case Impact</div>
                {decision.results.map((r, i) => {
                  const best = r.outcomes.find(o => o.type === 'best');
                  return (
                    <div key={i} className={styles.compareValue}>
                      <span style={{ color: 'var(--success)' }}>{best?.financialImpact || 'N/A'}</span>
                    </div>
                  );
                })}
              </div>
              {/* Worst Case */}
              <div className={styles.compareRow}>
                <div className={styles.compareMetric}>Worst Case Impact</div>
                {decision.results.map((r, i) => {
                  const worst = r.outcomes.find(o => o.type === 'worst');
                  return (
                    <div key={i} className={styles.compareValue}>
                      <span style={{ color: 'var(--danger)' }}>{worst?.financialImpact || 'N/A'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`glass-panel ${styles.emptyState}`}>
          <p>No simulation results available for this decision.</p>
        </div>
      )}
    </div>
  );
}

export default function Timeline() {
  return (
    <Suspense fallback={
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading timeline...
      </div>
    }>
      <TimelineContent />
    </Suspense>
  );
}
