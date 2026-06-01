import styles from './ProgressBar.module.css'
import type { Step } from '../../../types/registration'

const STEPS_NEW: { key: Step; label: string }[] = [
  { key: 'type-selector', label: 'Perfil' },
  { key: 'contact', label: 'Contato' },
  { key: 'business-new', label: 'Empresa & Plano' },
  { key: 'review', label: 'Revisão' },
]

const STEPS_MIGRATION: { key: Step; label: string }[] = [
  { key: 'type-selector', label: 'Perfil' },
  { key: 'contact', label: 'Contato' },
  { key: 'business-migration', label: 'Empresa' },
  { key: 'plan', label: 'Plano' },
  { key: 'review', label: 'Revisão' },
]

const STEP_ORDER: Step[] = [
  'type-selector',
  'contact',
  'business-new',
  'business-migration',
  'plan',
  'review',
  'success',
]

interface ProgressBarProps {
  currentStep: Step
  clientType: 'new' | 'migration' | null
}

export function ProgressBar({ currentStep, clientType }: ProgressBarProps) {
  if (currentStep === 'success') return null

  const steps = clientType === 'migration' ? STEPS_MIGRATION : STEPS_NEW
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  const getStepIndex = (key: Step) => STEP_ORDER.indexOf(key)

  return (
    <div className={styles.wrapper}>
      {steps.map((step, i) => {
        const stepIndex = getStepIndex(step.key)
        const done = stepIndex < currentIndex
        const active = stepIndex === currentIndex

        return (
          <div key={step.key} className={styles.stepItem}>
            <div className={`${styles.circle} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`${styles.label} ${active ? styles.activeLabel : ''}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`${styles.line} ${done ? styles.lineDone : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
