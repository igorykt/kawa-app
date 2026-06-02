import { useForm } from 'react-hook-form'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import styles from './StepForm.module.css'

function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export interface MigrationContactData {
  name: string
  email: string
  phone: string
}

interface Props {
  onSubmit: (data: MigrationContactData) => void
  onBack: () => void
}

export function StepMigrationContact({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<MigrationContactData>()

  const phoneReg = register('phone', {
    required: 'Telefone obrigatório.',
    setValueAs: (v: string) => v.replace(/\D/g, ''),
    validate: v => (v.length >= 10 && v.length <= 11) || 'Telefone inválido.',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Trazer minha empresa</h2>
      <p className={styles.subtitle}>
        Preencha seus dados e nossa equipe entrará em contato para cuidar de toda a migração.
      </p>

      <div className={styles.grid}>
        <div className={styles.fullWidth}>
          <Input
            label="Nome completo"
            placeholder="Ex.: Ana Paula Souza"
            error={errors.name?.message}
            {...register('name', {
              required: 'Nome obrigatório.',
              setValueAs: (v: string) => v.trim(),
              validate: v => v.trim().length >= 3 || 'Mínimo 3 caracteres.',
            })}
          />
        </div>

        <Input
          label="E-mail"
          type="email"
          placeholder="seuemail@exemplo.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'E-mail obrigatório.',
            setValueAs: (v: string) => v.trim(),
            pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'E-mail inválido.' },
          })}
        />

        <Input
          label="Telefone / WhatsApp"
          placeholder="(11) 99999-9999"
          maxLength={15}
          error={errors.phone?.message}
          {...phoneReg}
          onChange={e => {
            e.target.value = maskPhone(e.target.value)
            phoneReg.onChange(e)
          }}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button type="submit">Entrar em contato →</Button>
      </div>
    </form>
  )
}
