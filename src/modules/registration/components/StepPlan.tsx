import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import type { ClientType, Plan } from '../../../types/registration'
import styles from './StepPlan.module.css'

interface PlanOption {
  id: Plan
  name: string
  price: number
  description: string
  features: string[]
  recommended?: boolean
  forType?: ClientType
}

const PLANS: PlanOption[] = [
  {
    id: 'MEI',
    name: 'MEI',
    price: 69,
    description: 'Para quem está abrindo MEI.',
    features: ['Abertura de MEI', 'Declaração anual DASN', 'Emissão de DAS', 'Suporte via chat', 'Emissão de notas fiscais'],
    forType: 'new',
  },
  {
    id: 'Essencial',
    name: 'Essencial',
    price: 195,
    description: 'Para microempresas no Simples Nacional.',
    features: ['Abertura de empresa grátis', 'Escrituração contábil', 'Apuração de impostos', 'Notas fiscais ilimitadas', 'Contador dedicado', 'Folha (até 3 colaboradores)'],
    recommended: true,
  },
  {
    id: 'Profissional',
    name: 'Profissional',
    price: 390,
    description: 'Para empresas em crescimento.',
    features: ['Tudo do Essencial', 'Lucro Presumido / Real', 'Folha ilimitada', 'Planejamento tributário', 'Relatórios gerenciais', 'Consultoria por vídeo'],
  },
]

interface Props {
  clientType: ClientType | null
  defaultPlan?: Plan | null
  onSubmit: (plan: Plan) => void
  onBack: () => void
}

export function StepPlan({ clientType, defaultPlan, onSubmit, onBack }: Props) {
  const [selected, setSelected] = useState<Plan | null>(defaultPlan ?? null)

  const plans = PLANS.filter(p => !p.forType || p.forType === clientType || clientType === 'migration')

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Escolha seu plano</h2>
      <p className={styles.subtitle}>Sem taxas ocultas. Cancele quando quiser no plano mensal.</p>

      <div className={styles.grid}>
        {plans.map(plan => (
          <button
            key={plan.id}
            className={`${styles.card} ${selected === plan.id ? styles.selected : ''} ${plan.recommended ? styles.recommended : ''}`}
            onClick={() => setSelected(plan.id)}
          >
            {plan.recommended && <span className={styles.badge}>✦ Mais popular</span>}
            <div className={styles.planName}>{plan.name}</div>
            <p className={styles.planDesc}>{plan.description}</p>
            <div className={styles.price}>
              <span className={styles.currency}>R$</span>
              <span className={styles.amount}>{plan.price}</span>
              <span className={styles.period}>/mês</span>
            </div>
            <ul className={styles.features}>
              {plan.features.map(f => (
                <li key={f}><span className={styles.check}>✓</span>{f}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
        >
          Continuar →
        </Button>
      </div>
    </div>
  )
}
