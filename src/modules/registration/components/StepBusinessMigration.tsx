import { useForm } from 'react-hook-form'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import type { RegistrationState } from '../../../types/registration'
import styles from './StepForm.module.css'

type BusinessMigrationData = NonNullable<RegistrationState['businessMigration']>

const TAX_REGIMES = [
  { value: 'SimplesNacional', label: 'Simples Nacional' },
  { value: 'LucroPresumido', label: 'Lucro Presumido' },
  { value: 'LucroReal', label: 'Lucro Real' },
]

interface Props {
  defaultValues?: BusinessMigrationData | null
  onSubmit: (data: BusinessMigrationData) => void
  onBack: () => void
}

export function StepBusinessMigration({ defaultValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessMigrationData>({
    defaultValues: defaultValues ?? undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Dados da sua empresa</h2>
      <p className={styles.subtitle}>Precisamos dessas informações para cuidar da migração.</p>

      <div className={styles.grid}>
        <Input
          label="CNPJ"
          placeholder="00.000.000/0001-00"
          error={errors.cnpj?.message}
          {...register('cnpj', {
            required: 'CNPJ obrigatório.',
            setValueAs: (v: string) => v.replace(/\D/g, ''),
            validate: (v) => v.length === 14 || 'CNPJ deve ter 14 dígitos.',
          })}
        />

        <Input
          label="Razão social"
          placeholder="Nome da empresa conforme CNPJ"
          error={errors.companyName?.message}
          {...register('companyName', { required: 'Razão social obrigatória.' })}
        />

        <Select
          label="Regime tributário atual"
          options={TAX_REGIMES}
          error={errors.currentTaxRegime?.message}
          {...register('currentTaxRegime', { required: 'Selecione o regime.' })}
        />

        <Input
          label="Contador ou escritório atual"
          placeholder="Nome do contador ou escritório"
          error={errors.currentAccountant?.message}
          {...register('currentAccountant', { required: 'Campo obrigatório.' })}
        />

        <Input
          label="Número de funcionários"
          type="number"
          placeholder="0"
          error={errors.employeeCount?.message}
          {...register('employeeCount', {
            required: 'Campo obrigatório.',
            valueAsNumber: true,
            min: { value: 0, message: 'Valor inválido.' },
          })}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button type="submit">Continuar →</Button>
      </div>
    </form>
  )
}
