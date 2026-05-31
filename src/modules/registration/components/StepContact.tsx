import { useForm } from 'react-hook-form'
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
              minLength: { value: 3, message: 'Mínimo 3 caracteres.' },
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
            validate: (v) => v.length === 11 || 'CPF deve ter 11 dígitos.',
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
