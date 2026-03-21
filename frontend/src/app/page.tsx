'use client';

import styles from './page.module.css';
import { Plus, ArrowRight, TrendingUp, Zap, Clock, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDecisions } from '@/context/DecisionContext';

export default function Home() {
  const { decisions, deleteDecision } = useDecisions();

  const simulated = decisions.filter(d => d.status === 'simulated');
  const pending = decisions.filter(d => d.status === 'pending');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const categoryColors: Record<string, string> = {
    Career: '#7c3aed',
    Finance: '#06b6d4',
    Education: '#34d399',
    Relocation: '#f472b6',
    Health: '#fbbf24',
    Relationships: '#f87171',
  };

  return (
    <div className={`container ${styles.dashboard}`}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className={styles.greeting}>
            Welcome to <span className="text-gradient">DecisionAI</span>
          </h1>
          <p className={styles.subtitle}>Simulate life decisions. Predict outcomes. Make smarter choices.</p>
        </div>
        <Link href="/new-decision" className={`btn-primary ${styles.newBtn}`}>
          <Plus size={18} />
          New Decision
        </Link>
      </header>

      <section className={styles.statsRow}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <TrendingUp size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Simulated</p>
            <h3 className={styles.statValue}>{simulated.length}</h3>
          </div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Pending</p>
            <h3 className={styles.statValue}>{pending.length}</h3>
          </div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
            <Zap size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total</p>
            <h3 className={styles.statValue}>{decisions.length}</h3>
          </div>
        </div>
      </section>

      {pending.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>⏳ Pending Simulation</h2>
          </div>
          <div className={styles.decisionGrid}>
            {pending.map((d, i) => (
              <div key={d.id} className={`glass-panel ${styles.decisionCard} ${styles.pendingCard}`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.cardHeader}>
                  <span className={styles.tag} style={{ borderColor: categoryColors[d.category] || '#7c3aed', color: categoryColors[d.category] || '#7c3aed' }}>
                    {d.category}
                  </span>
                  <span className={styles.date}>{formatDate(d.createdAt)}</span>
                </div>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <p className={styles.decisionDesc}>{d.context}</p>
                <div className={styles.cardActions}>
                  <Link href={`/timeline?id=${d.id}`} className={`btn-primary ${styles.simulateBtn}`}>
                    <Sparkles size={14} /> Simulate Now
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => deleteDecision(d.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Simulations</h2>
          <Link href="/timeline" className={styles.viewAll}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {simulated.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <Sparkles size={40} className={styles.emptyIcon} />
            <h3>No simulations yet</h3>
            <p>Create your first decision and run a simulation to see results here.</p>
            <Link href="/new-decision" className="btn-primary">Get Started</Link>
          </div>
        ) : (
          <div className={styles.decisionGrid}>
            {simulated.slice(0, 6).map((d, i) => (
              <Link href={`/timeline?id=${d.id}`} key={d.id} className={`glass-panel ${styles.decisionCard}`} style={{ animationDelay: `${i * 0.08}s`, textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.cardHeader}>
                  <span className={styles.tag} style={{ borderColor: categoryColors[d.category] || '#7c3aed', color: categoryColors[d.category] || '#7c3aed' }}>
                    {d.category}
                  </span>
                  <span className={styles.date}>{formatDate(d.createdAt)}</span>
                </div>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <p className={styles.decisionDesc}>{d.context}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.confidenceMeter}>
                    <div className={styles.confidenceTrack}>
                      <div className={styles.confidenceBar} style={{ width: `${d.confidence}%` }}></div>
                    </div>
                    <span className={styles.confidenceText}>{d.confidence}% Confidence</span>
                  </div>
                  <span className={styles.optionCount}>{d.options.length} options</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
