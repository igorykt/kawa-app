import { useForm } from 'react-hook-form'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import type { RegistrationState } from '../../../types/registration'
import styles from './StepForm.module.css'

type BusinessNewData = NonNullable<RegistrationState['businessNew']>

const BUSINESS_TYPES = [
  { value: 'MEI', label: 'MEI — Microempreendedor Individual' },
  { value: 'ME', label: 'ME — Microempresa' },
  { value: 'EPP', label: 'EPP — Empresa de Pequeno Porte' },
]

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
].map(s => ({ value: s, label: s }))

interface Props {
  defaultValues?: BusinessNewData | null
  onSubmit: (data: BusinessNewData) => void
  onBack: () => void
}

export function StepBusinessNew({ defaultValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessNewData>({
    defaultValues: defaultValues ?? undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Sobre o seu negócio</h2>
      <p className={styles.subtitle}>Nos conte um pouco sobre a empresa que você quer abrir.</p>

      <div className={styles.grid}>
        <Select
          label="Tipo de empresa desejado"
          options={BUSINESS_TYPES}
          error={errors.desiredBusinessType?.message}
          {...register('desiredBusinessType', { required: 'Selecione o tipo.' })}
        />

        <Input
          label="Nome desejado para a empresa"
          placeholder="Ex.: Ana Souza Serviços"
          error={errors.desiredBusinessName?.message}
          {...register('desiredBusinessName', { required: 'Nome obrigatório.' })}
        />

        <div className={styles.fullWidth}>
          <Input
            label="Atividade principal"
            placeholder="Ex.: Desenvolvimento de software, consultoria em TI..."
            error={errors.mainActivity?.message}
            {...register('mainActivity', { required: 'Descreva a atividade principal.' })}
          />
        </div>

        <Input
          label="Cidade"
          placeholder="Ex.: São Paulo"
          error={errors.city?.message}
          {...register('city', { required: 'Cidade obrigatória.' })}
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
        <Button type="submit">Continuar →</Button>
      </div>
    </form>
  )
}
