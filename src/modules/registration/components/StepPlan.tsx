import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import type { ClientType, Plan } from '../../../types/registration'
import styles from './StepPlan.module.css'

interface PlanDetail {
  id: Plan
  name: string
  legalType: string
  price: number
  revenue: string
  employees: string
  forWhom: string
  pros: string[]
  cons: string[]
  forType?: ClientType
}

const PLANS: PlanDetail[] = [
  {
    id: 'MEI',
    name: 'MEI',
    legalType: 'Microempreendedor Individual',
    price: 69,
    revenue: 'Até R$ 81 mil / ano',
    employees: 'Até 1 funcionário',
    forWhom: 'Autônomos, freelancers e prestadores de serviço que trabalham por conta própria e querem se formalizar da forma mais simples possível.',
    pros: [
      'Impostos fixos e muito baixos (DAS mensal)',
      'Abertura 100% online e gratuita',
      'CNPJ próprio para emitir notas fiscais',
      'Acesso a crédito empresarial e benefícios do INSS',
      'Processo burocrático mínimo',
    ],
    cons: [
      'Faturamento limitado a R$ 81 mil por ano',
      'Não pode ter sócio',
      'Máximo 1 funcionário',
      'Atividades permitidas são restritas (nem toda profissão pode ser MEI)',
      'Sem possibilidade de crescimento dentro do próprio CNPJ',
    ],
    forType: 'new',
  },
  {
    id: 'Essencial',
    name: 'Essencial',
    legalType: 'ME — Microempresa',
    price: 195,
    revenue: 'Até R$ 360 mil / ano',
    employees: 'Até 10 funcionários',
    forWhom: 'Pequenos negócios com mais de um sócio, mais de uma atividade ou que já ultrapassaram o limite do MEI e precisam de uma estrutura contábil completa.',
    pros: [
      'Limite de faturamento maior que o MEI',
      'Permite ter sócios',
      'Mais atividades permitidas',
      'Regime Simples Nacional — impostos unificados e simplificados',
      'Melhor imagem para clientes e fornecedores',
    ],
    cons: [
      'Custo mensal maior que o MEI',
      'Exige contabilidade formal obrigatória',
      'Mais obrigações acessórias (declarações, registros)',
      'Burocracia de abertura maior que o MEI',
    ],
  },
  {
    id: 'Profissional',
    name: 'Profissional',
    legalType: 'EPP — Empresa de Pequeno Porte',
    price: 390,
    revenue: 'Até R$ 4,8 milhões / ano',
    employees: 'Sem limite de funcionários',
    forWhom: 'Empresas em crescimento que precisam de regimes tributários mais sofisticados (Lucro Presumido ou Lucro Real), mais funcionários ou planejamento tributário estratégico.',
    pros: [
      'Faturamento até R$ 4,8 milhões por ano',
      'Sem limite de funcionários',
      'Acesso a Lucro Presumido e Lucro Real',
      'Planejamento tributário pode reduzir impostos significativamente',
      'Estrutura ideal para empresas que buscam investidores ou crescimento rápido',
    ],
    cons: [
      'Custo contábil mais elevado',
      'Maior complexidade de obrigações fiscais',
      'Exige acompanhamento contábil mais próximo',
      'Nem sempre é a melhor opção para negócios menores — pode pagar mais imposto que no Simples',
    ],
  },
]

interface Props {
  clientType: ClientType | null
  defaultPlan?: Plan | null
  onSubmit: (plan: Plan) => void
  onBack: () => void
}

export function StepPlan({ clientType, defaultPlan, onSubmit, onBack }: Props) {
  const plans = PLANS.filter(p => !p.forType || p.forType === clientType || clientType === 'migration')
  const [selected, setSelected] = useState<Plan | null>(defaultPlan ?? plans[0]?.id ?? null)

  const detail = plans.find(p => p.id === selected) ?? null

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Escolha seu plano</h2>
      <p className={styles.subtitle}>Selecione uma opção para entender qual se encaixa melhor no seu negócio.</p>

      <div className={styles.layout}>
        <div className={styles.optionList}>
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`${styles.option} ${selected === plan.id ? styles.optionSelected : ''}`}
              onClick={() => setSelected(plan.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected(plan.id)}
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

        {detail && (
          <div className={styles.detail}>
            <p className={styles.detailForWhom}>{detail.forWhom}</p>

            <div className={styles.proscons}>
              <div className={styles.pros}>
                <div className={styles.prosconsTitle}>
                  <span className={styles.iconPro}>+</span> Vantagens
                </div>
                <ul className={styles.list}>
                  {detail.pros.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.cons}>
                <div className={styles.prosconsTitle}>
                  <span className={styles.iconCon}>−</span> Desvantagens
                </div>
                <ul className={styles.list}>
                  {detail.cons.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
        >
          Continuar com {detail?.name} →
        </Button>
      </div>
    </div>
  )
}
