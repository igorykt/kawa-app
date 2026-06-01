import { useForm } from 'react-hook-form'

function isValidCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const calc = (len: number) => {
    const rem = (Array.from({ length: len }, (_, i) => Number(cpf[i]) * (len + 1 - i)).reduce((a, b) => a + b, 0) * 10) % 11
    return rem >= 10 ? 0 : rem
  }
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10])
}
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import type { RegistrationState } from '../../../types/registration'
import styles from './StepForm.module.css'

type ContactData = NonNullable<RegistrationState['contact']>

interface Props {
  defaultValues?: ContactData | null
  onSubmit: (data: ContactData) => void
  onBack: () => void
}

export function StepContact({ defaultValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactData>({
    defaultValues: defaultValues ?? undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Seus dados de contato</h2>
      <p className={styles.subtitle}>Vamos precisar dessas informações para criar sua conta.</p>

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
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Telefone obrigatório.',
            setValueAs: (v: string) => v.replace(/\D/g, ''),
            validate: (v) => (v.length >= 10 && v.length <= 11) || 'Telefone inválido.',
          })}
        />

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          error={errors.cpf?.message}
          {...register('cpf', {
            required: 'CPF obrigatório.',
            setValueAs: (v: string) => v.replace(/\D/g, ''),
            validate: (v) => isValidCpf(v) || 'CPF inválido.',
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
