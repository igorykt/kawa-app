import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { usePlans } from '../../../hooks/usePlans'
import type { PlanConfig } from '../../../services/planService'
import type { BusinessType, Plan, RegistrationState } from '../../../types/registration'
import styles from './StepForm.module.css'
import typeStyles from './StepBusinessNew.module.css'

type BusinessNewData = NonNullable<RegistrationState['businessNew']>

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
].map(s => ({ value: s, label: s }))

const PLAN_TO_BUSINESS_TYPE: Record<string, BusinessType> = {
  MEI: 'MEI',
  Essencial: 'ME',
  Profissional: 'EPP',
}

interface Props {
  defaultValues?: BusinessNewData | null
  defaultPlan?: Plan | null
  onSubmit: (data: BusinessNewData, plan: Plan) => void
  onBack: () => void
}

export function StepBusinessNew({ defaultValues, defaultPlan, onSubmit, onBack }: Props) {
  const { plans, loading, error } = usePlans()
  const [selected, setSelected] = useState<PlanConfig | null>(null)
  const [typeError, setTypeError] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<BusinessNewData>({
    defaultValues: defaultValues ?? undefined,
  })

  // Pre-select when plans load
  const handleSelect = (plan: PlanConfig) => {
    setSelected(plan)
    setTypeError(false)
  }

  const resolvedSelected = selected ?? (defaultPlan && plans.find(p => p.name === defaultPlan)) ?? null

  const handleFormSubmit = (data: BusinessNewData) => {
    if (!resolvedSelected) { setTypeError(true); return }
    const businessType = PLAN_TO_BUSINESS_TYPE[resolvedSelected.name] ?? 'ME'
    onSubmit({ ...data, desiredBusinessType: businessType }, resolvedSelected.name as Plan)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <h2 className={styles.title}>Empresa & Plano</h2>
      <p className={styles.subtitle}>Escolha o tipo de empresa — isso define automaticamente o plano ideal para você.</p>

      <div className={typeStyles.sectionLabel}>
        Qual tipo de empresa você quer abrir?
        {typeError && <span className={typeStyles.error}> Selecione uma opção.</span>}
      </div>

      {loading && <div className={typeStyles.loadingPlans}>Carregando planos...</div>}
      {error && <div className={typeStyles.errorPlans}>Não foi possível carregar os planos. Tente novamente.</div>}

      {!loading && !error && (
        <div className={typeStyles.layout}>
          <div className={typeStyles.optionList}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`${typeStyles.option} ${resolvedSelected?.id === plan.id ? typeStyles.selected : ''}`}
                onClick={() => handleSelect(plan)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelect(plan)}
              >
                <div className={typeStyles.optionTop}>
                  <div>
                    <div className={typeStyles.optionName}>{plan.name}</div>
                    <div className={typeStyles.optionLegal}>{plan.legalType}</div>
                  </div>
                  <div className={typeStyles.optionPrice}>
                    R$ {plan.price}<span>/mês</span>
                  </div>
                </div>
                <div className={typeStyles.optionMeta}>
                  <span>{plan.revenue}</span>
                  <span className={typeStyles.dot}>·</span>
                  <span>{plan.employees}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={typeStyles.detail}>
            {resolvedSelected ? (
              <>
                <p className={typeStyles.forWhom}>{resolvedSelected.forWhom}</p>
                <div className={typeStyles.proscons}>
                  <div>
                    <div className={`${typeStyles.prosconsTitle} ${typeStyles.pro}`}>
                      <span className={typeStyles.iconPro}>+</span> Vantagens
                    </div>
                    <ul className={typeStyles.list}>
                      {resolvedSelected.pros.map(p => <li key={p} className={typeStyles.proItem}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className={`${typeStyles.prosconsTitle} ${typeStyles.con}`}>
                      <span className={typeStyles.iconCon}>−</span> Desvantagens
                    </div>
                    <ul className={typeStyles.list}>
                      {resolvedSelected.cons.map(c => <li key={c} className={typeStyles.conItem}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className={typeStyles.placeholder}>
                Selecione um tipo ao lado para ver as vantagens e desvantagens.
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.fullWidth}>
          <Input
            label="Nome desejado para a empresa"
            placeholder="Ex.: Ana Souza Serviços"
            error={errors.desiredBusinessName?.message}
            {...register('desiredBusinessName', {
              required: 'Nome obrigatório.',
              setValueAs: (v: string) => v.trim(),
              validate: v => v.trim().length > 0 || 'Nome obrigatório.',
            })}
          />
        </div>
        <div className={styles.fullWidth}>
          <Input
            label="Atividade principal"
            placeholder="Ex.: Desenvolvimento de software, consultoria em TI..."
            error={errors.mainActivity?.message}
            {...register('mainActivity', {
              required: 'Descreva a atividade principal.',
              setValueAs: (v: string) => v.trim(),
              validate: v => v.trim().length > 0 || 'Descreva a atividade principal.',
            })}
          />
        </div>
        <Input
          label="Cidade"
          placeholder="Ex.: São Paulo"
          error={errors.city?.message}
          {...register('city', {
            required: 'Cidade obrigatória.',
            setValueAs: (v: string) => v.trim(),
            validate: v => v.trim().length > 0 || 'Cidade obrigatória.',
          })}
        />
        <Select
          label="Estado"
          options={STATES}
          error={errors.state?.message}
          {...register('state', { required: 'Estado obrigatório.' })}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button type="submit">
          {resolvedSelected ? `Continuar com ${resolvedSelected.name} →` : 'Continuar →'}
        </Button>
      </div>
    </form>
  )
}
