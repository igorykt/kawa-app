import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import type { AddressData } from '../../../types/registration'
import styles from './StepForm.module.css'
import addrStyles from './StepAddress.module.css'

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
].map(s => ({ value: s, label: s }))

function maskCep(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

function formatDefaultCep(cep?: string) {
  if (!cep) return ''
  return maskCep(cep)
}

interface Props {
  defaultValues?: AddressData | null
  onSubmit: (data: AddressData) => void
  onBack: () => void
}

export function StepAddress({ defaultValues, onSubmit, onBack }: Props) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'found' | 'not-found' | 'error'>('idle')
  const numeroInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<AddressData>({
    defaultValues: defaultValues
      ? { ...defaultValues, cep: formatDefaultCep(defaultValues.cep) }
      : undefined,
  })

  const { ref: numeroRegRef, ...numeroRest } = register('numero', {
    required: 'Número obrigatório.',
    setValueAs: (v: string) => v.trim(),
    validate: v => v.trim().length > 0 || 'Número obrigatório.',
  })

  const cepReg = register('cep', {
    required: 'CEP obrigatório.',
    setValueAs: (v: string) => v.replace(/\D/g, ''),
    validate: v => v.replace(/\D/g, '').length === 8 || 'CEP deve ter 8 dígitos.',
  })

  async function lookupCep(digits: string) {
    setCepLoading(true)
    setCepStatus('idle')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepStatus('not-found')
        setError('cep', { message: 'CEP não encontrado.' })
        return
      }
      setValue('logradouro', data.logradouro ?? '', { shouldValidate: true })
      setValue('bairro', data.bairro ?? '', { shouldValidate: true })
      setValue('city', data.localidade ?? '', { shouldValidate: true })
      setValue('state', data.uf ?? '', { shouldValidate: true })
      clearErrors(['cep', 'logradouro', 'bairro', 'city', 'state'])
      setCepStatus('found')
      setTimeout(() => numeroInputRef.current?.focus(), 0)
    } catch {
      setCepStatus('error')
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Endereço da empresa</h2>
      <p className={styles.subtitle}>Digite o CEP e os campos serão preenchidos automaticamente.</p>

      <div className={styles.grid}>
        <div className={addrStyles.cepWrapper}>
          <Input
            label="CEP"
            placeholder="00000-000"
            maxLength={9}
            error={errors.cep?.message}
            {...cepReg}
            onChange={e => {
              const masked = maskCep(e.target.value)
              e.target.value = masked
              cepReg.onChange(e)
              const digits = masked.replace(/\D/g, '')
              if (digits.length === 8) lookupCep(digits)
              else setCepStatus('idle')
            }}
          />
          {cepLoading && <span className={addrStyles.cepHint}>Buscando...</span>}
          {!cepLoading && cepStatus === 'found' && (
            <span className={`${addrStyles.cepHint} ${addrStyles.cepFound}`}>✓ Endereço encontrado</span>
          )}
          {!cepLoading && cepStatus === 'not-found' && (
            <span className={`${addrStyles.cepHint} ${addrStyles.cepNotFound}`}>CEP não encontrado</span>
          )}
          {!cepLoading && cepStatus === 'error' && (
            <span className={`${addrStyles.cepHint} ${addrStyles.cepNotFound}`}>Erro ao buscar CEP</span>
          )}
        </div>

        <div />

        <div className={styles.fullWidth}>
          <Input
            label="Logradouro"
            placeholder="Preenchido automaticamente pelo CEP"
            error={errors.logradouro?.message}
            {...register('logradouro', {
              required: 'Logradouro obrigatório.',
              setValueAs: (v: string) => v.trim(),
              validate: v => v.trim().length > 0 || 'Logradouro obrigatório.',
            })}
          />
        </div>

        <Input
          label="Número"
          placeholder="Ex.: 123"
          error={errors.numero?.message}
          ref={el => {
            numeroInputRef.current = el
            numeroRegRef(el)
          }}
          {...numeroRest}
        />

        <Input
          label="Complemento (opcional)"
          placeholder="Ex.: Sala 4, Apto 12..."
          {...register('complemento', {
            setValueAs: (v: string) => v.trim() || undefined,
          })}
        />

        <div className={styles.fullWidth}>
          <Input
            label="Bairro"
            placeholder="Preenchido automaticamente pelo CEP"
            error={errors.bairro?.message}
            {...register('bairro', {
              required: 'Bairro obrigatório.',
              setValueAs: (v: string) => v.trim(),
              validate: v => v.trim().length > 0 || 'Bairro obrigatório.',
            })}
          />
        </div>

        <Input
          label="Cidade"
          placeholder="Preenchida automaticamente pelo CEP"
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
        <Button type="submit">Continuar →</Button>
      </div>
    </form>
  )
}
