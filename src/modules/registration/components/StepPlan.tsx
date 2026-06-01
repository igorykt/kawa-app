import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { usePlans } from '../../../hooks/usePlans'
import type { PlanConfig } from '../../../services/planService'
import type { Plan } from '../../../types/registration'
import styles from './StepPlan.module.css'

interface Props {
  defaultPlan?: Plan | null
  onSubmit: (plan: Plan) => void
  onBack: () => void
}

export function StepPlan({ defaultPlan, onSubmit, onBack }: Props) {
  const { plans, loading, error } = usePlans()
  const [selected, setSelected] = useState<PlanConfig | null>(null)

  const resolvedSelected = selected ?? (defaultPlan && plans.find(p => p.name === defaultPlan)) ?? (plans[0] ?? null)

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Escolha seu plano</h2>
      <p className={styles.subtitle}>Selecione uma opção para entender qual se encaixa melhor no seu negócio.</p>

      {loading && <div className={styles.loading}>Carregando planos...</div>}
      {error && <div className={styles.loadError}>Não foi possível carregar os planos. Tente novamente.</div>}

      {!loading && !error && (
        <div className={styles.layout}>
          <div className={styles.optionList}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`${styles.option} ${resolvedSelected?.id === plan.id ? styles.optionSelected : ''}`}
                onClick={() => setSelected(plan)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(plan)}
              >
                <div className={styles.optionHeader}>
                  <div>
                    <div className={styles.optionName}>{plan.name}</div>
                    <div className={styles.optionLegal}>{plan.legalType}</div>
                  </div>
                  <div className={styles.optionPrice}>
                    <span className={styles.optionAmount}>R$ {plan.price}</span>
                    <span className={styles.optionPeriod}>/mês</span>
                  </div>
                </div>
                <div className={styles.optionMeta}>
                  <span>{plan.revenue}</span>
                  <span className={styles.dot}>·</span>
                  <span>{plan.employees}</span>
                </div>
              </div>
            ))}
          </div>

          {resolvedSelected && (
            <div className={styles.detail}>
              <p className={styles.detailForWhom}>{resolvedSelected.forWhom}</p>
              <div className={styles.proscons}>
                <div className={styles.pros}>
                  <div className={styles.prosconsTitle}>
                    <span className={styles.iconPro}>+</span> Vantagens
                  </div>
                  <ul className={styles.list}>
                    {resolvedSelected.pros.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div className={styles.cons}>
                  <div className={styles.prosconsTitle}>
                    <span className={styles.iconCon}>−</span> Desvantagens
                  </div>
                  <ul className={styles.list}>
                    {resolvedSelected.cons.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button
          type="button"
          disabled={!resolvedSelected}
          onClick={() => resolvedSelected && onSubmit(resolvedSelected.name as Plan)}
        >
          Continuar com {resolvedSelected?.name} →
        </Button>
      </div>
    </div>
  )
}
