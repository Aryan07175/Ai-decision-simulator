'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, GitBranch, BarChart3, Sparkles } from 'lucide-react';
import styles from './Sidebar.module.css';

const Navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'New Decision', href: '/new-decision', icon: Target },
  { name: 'Timeline', href: '/timeline', icon: GitBranch },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sparkles size={18} />
          </div>
          <h2>Decision<span>AI</span></h2>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Navigation</p>
          {Navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.iconWrap}>
                  <Icon size={18} />
                </div>
                <span>{item.name}</span>
                {isActive && <div className={styles.activeIndicator}></div>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.proCard}>
            <div className={styles.proGlow}></div>
            <Sparkles size={16} className={styles.proIcon} />
            <p className={styles.proTitle}>AI Decision Simulator</p>
            <p className={styles.proDesc}>What-if engine for life</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
