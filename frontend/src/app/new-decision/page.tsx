'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useDecisions } from '@/context/DecisionContext';
import styles from './new-decision.module.css';

const CATEGORIES = ['Career', 'Finance', 'Education', 'Relocation', 'Health', 'Relationships'];

export default function NewDecision() {
  const router = useRouter();
  const { addDecision, simulateDecision } = useDecisions();

  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState('Career');
  const [horizon, setHorizon] = useState(5);
  const [options, setOptions] = useState([
    { label: 'Option A', description: '' },
    { label: 'Option B', description: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    const letter = String.fromCharCode(65 + options.length);
    setOptions([...options, { label: `Option ${letter}`, description: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'label' | 'description', value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const handleSubmit = async (runSim: boolean) => {
    if (!title.trim()) return;
    setIsSubmitting(true);

    // brief delay for UX feel
    await new Promise(r => setTimeout(r, 600));

    const decision = addDecision({
      title: title.trim(),
      context: context.trim(),
      category,
      options: options.map(o => ({
        label: o.label,
        description: o.description || o.label,
      })),
      horizon,
    });

    if (runSim) {
      // brief "simulation" delay
      await new Promise(r => setTimeout(r, 800));
      simulateDecision(decision.id);
      router.push(`/timeline?id=${decision.id}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back
        </Link>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Simulate a <span className="text-gradient">New Decision</span>
          </h1>
          <p className={styles.subtitle}>Define the parameters, and let DecisionAI predict the possible outcomes.</p>
        </div>
      </header>

      <div className={styles.formContainer}>
        {/* Decision Details */}
        <div className={`glass-panel ${styles.formSection}`}>
          <div className={styles.sectionLabel}>
            <Zap size={16} />
            <span>Decision Details</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Decision Title *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Should I relocate to New York for a new job?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Context & Background</label>
            <textarea
              className={`input-field ${styles.textarea}`}
              placeholder="Provide background context about your current situation..."
              rows={4}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={`input-field ${styles.select}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Simulation Horizon</label>
              <select
                className={`input-field ${styles.select}`}
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
              >
                <option value={1}>1 Year</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className={`glass-panel ${styles.formSection}`}>
          <div className={styles.sectionLabelRow}>
            <div className={styles.sectionLabel}>
              <Sparkles size={16} />
              <span>Possible Options</span>
            </div>
            <button className={`btn-secondary ${styles.addBtn}`} onClick={addOption}>
              <Plus size={15} /> Add
            </button>
          </div>

          <div className={styles.optionsList}>
            {options.map((opt, index) => (
              <div key={index} className={styles.optionItem}>
                <div className={styles.optionMarker}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div className={styles.optionFields}>
                  <input
                    type="text"
                    className={`input-field ${styles.optionLabel}`}
                    placeholder="Option name..."
                    value={opt.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    className={`input-field ${styles.optionDesc}`}
                    placeholder="Brief description of this path..."
                    value={opt.description}
                    onChange={(e) => updateOption(index, 'description', e.target.value)}
                  />
                </div>
                {options.length > 2 && (
                  <button className={styles.removeBtn} onClick={() => removeOption(index)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className={styles.submitRow}>
          <button
            className={`btn-secondary ${styles.saveDraftBtn}`}
            onClick={() => handleSubmit(false)}
            disabled={!title.trim() || isSubmitting}
          >
            Save as Draft
          </button>
          <button
            className={`btn-primary ${styles.submitBtn}`}
            onClick={() => handleSubmit(true)}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Simulating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Run Simulation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
