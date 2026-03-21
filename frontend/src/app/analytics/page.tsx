'use client';

import { TrendingUp, Target, PieChart, BrainCircuit, BarChart3 } from 'lucide-react';
import { useDecisions } from '@/context/DecisionContext';
import styles from './analytics.module.css';

export default function Analytics() {
  const { decisions } = useDecisions();
  const simulated = decisions.filter(d => d.status === 'simulated');

  // Compute category distribution
  const categoryMap: Record<string, number> = {};
  decisions.forEach(d => {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + 1;
  });
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = categories[0]?.[0] || 'N/A';
  const topCategoryPct = decisions.length > 0
    ? Math.round((categories[0]?.[1] || 0) / decisions.length * 100)
    : 0;

  // Avg confidence
  const avgConfidence = simulated.length > 0
    ? Math.round(simulated.reduce((sum, d) => sum + d.confidence, 0) / simulated.length)
    : 0;

  // Category colors
  const catColors: Record<string, string> = {
    Career: '#7c3aed',
    Finance: '#06b6d4',
    Education: '#34d399',
    Relocation: '#f472b6',
    Health: '#fbbf24',
    Relationships: '#f87171',
  };

  // Horizon distribution
  const horizonMap: Record<number, number> = {};
  decisions.forEach(d => {
    horizonMap[d.horizon] = (horizonMap[d.horizon] || 0) + 1;
  });
  const horizons = Object.entries(horizonMap).sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Decision <span className="text-gradient">Insights</span>
        </h1>
        <p className={styles.subtitle}>Aggregate analytics across all your simulated life choices.</p>
      </header>

      <div className={styles.kpiRow}>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <div className={styles.kpiIconWrap} style={{ color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)' }}>
            <BrainCircuit size={22} />
          </div>
          <div>
            <p className={styles.kpiLabel}>Decisions Made</p>
            <h3 className={styles.kpiValue}>{decisions.length}</h3>
          </div>
        </div>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <div className={styles.kpiIconWrap} style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)' }}>
            <Target size={22} />
          </div>
          <div>
            <p className={styles.kpiLabel}>Avg Confidence</p>
            <h3 className={styles.kpiValue}>{avgConfidence}%</h3>
          </div>
        </div>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <div className={styles.kpiIconWrap} style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.1)' }}>
            <PieChart size={22} />
          </div>
          <div>
            <p className={styles.kpiLabel}>Top Category</p>
            <h3 className={styles.kpiValue}>{topCategory}</h3>
            <p className={styles.kpiSub}>{topCategoryPct}% of total</p>
          </div>
        </div>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <div className={styles.kpiIconWrap} style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <p className={styles.kpiLabel}>Simulated</p>
            <h3 className={styles.kpiValue}>{simulated.length}</h3>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className={styles.chartsRow}>
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h3>Category Distribution</h3>
          </div>
          <div className={styles.barChart}>
            {categories.map(([cat, count], i) => (
              <div key={cat} className={styles.barGroup} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.barLabel}>{cat}</div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(count / decisions.length) * 100}%`,
                      background: catColors[cat] || '#7c3aed',
                    }}
                  ></div>
                </div>
                <div className={styles.barValue}>{count}</div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className={styles.noData}>No decisions yet. Create one to see analytics.</p>
            )}
          </div>
        </div>

        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h3>Simulation Horizons</h3>
          </div>
          <div className={styles.horizonChart}>
            {horizons.map(([yr, count], i) => (
              <div key={yr} className={styles.horizonItem} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className={styles.horizonBar}>
                  <div
                    className={styles.horizonFill}
                    style={{
                      height: `${Math.max((count / decisions.length) * 100, 15)}%`,
                    }}
                  ></div>
                </div>
                <div className={styles.horizonLabel}>{yr}Y</div>
                <div className={styles.horizonCount}>{count}</div>
              </div>
            ))}
            {horizons.length === 0 && (
              <p className={styles.noData}>No data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {simulated.length > 0 && (
        <div className={`glass-panel ${styles.activityCard}`}>
          <div className={styles.chartHeader}>
            <h3>Recent Simulation Activity</h3>
          </div>
          <div className={styles.activityList}>
            {simulated.slice(0, 5).map((d, i) => (
              <div key={d.id} className={styles.activityItem} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.activityDot} style={{ background: catColors[d.category] || '#7c3aed' }}></div>
                <div className={styles.activityInfo}>
                  <p className={styles.activityTitle}>{d.title}</p>
                  <p className={styles.activityMeta}>
                    {d.category} • {d.options.length} options • {d.confidence}% confidence
                  </p>
                </div>
                <div className={styles.activityDate}>
                  {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
