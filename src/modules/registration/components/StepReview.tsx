import { Button } from '../../../components/ui/Button'
import type { RegistrationState } from '../../../types/registration'
import styles from './StepReview.module.css'

const BUSINESS_TYPE_LABEL: Record<string, string> = { MEI: 'MEI', ME: 'ME', EPP: 'EPP' }
const TAX_REGIME_LABEL: Record<string, string> = {
  SimplesNacional: 'Simples Nacional',
  LucroPresumido: 'Lucro Presumido',
  LucroReal: 'Lucro Real',
}

interface Props {
  state: RegistrationState
  isSubmitting: boolean
  submitError: string | null
  onSubmit: () => void
  onBack: () => void
}

export function StepReview({ state, isSubmitting, submitError, onSubmit, onBack }: Props) {
  const { contact, businessNew, businessMigration, selectedPlan, clientType } = state

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Revise seus dados</h2>
      <p className={styles.subtitle}>Confira as informações antes de enviar o cadastro.</p>

      <div className={styles.sections}>
        <ReviewSection title="Perfil">
          <ReviewRow label="Tipo" value={clientType === 'new' ? 'Nova empresa' : 'Migração'} />
          <ReviewRow label="Plano" value={selectedPlan ?? ''} />
        </ReviewSection>

        {contact && (
          <ReviewSection title="Contato">
            <ReviewRow label="Nome" value={contact.name} />
            <ReviewRow label="E-mail" value={contact.email} />
            <ReviewRow label="Telefone" value={contact.phone} />
            <ReviewRow label="CPF" value={contact.cpf} />
          </ReviewSection>
        )}

        {businessNew && (
          <ReviewSection title="Empresa">
            <ReviewRow label="Tipo desejado" value={BUSINESS_TYPE_LABEL[businessNew.desiredBusinessType]} />
            <ReviewRow label="Nome desejado" value={businessNew.desiredBusinessName} />
            <ReviewRow label="Atividade" value={businessNew.mainActivity} />
            <ReviewRow label="Localização" value={`${businessNew.city} – ${businessNew.state}`} />
          </ReviewSection>
        )}

        {businessMigration && (
          <ReviewSection title="Empresa">
            <ReviewRow label="CNPJ" value={businessMigration.cnpj} />
            <ReviewRow label="Razão social" value={businessMigration.companyName} />
            <ReviewRow label="Regime tributário" value={TAX_REGIME_LABEL[businessMigration.currentTaxRegime]} />
            <ReviewRow label="Contador atual" value={businessMigration.currentAccountant} />
            <ReviewRow label="Funcionários" value={String(businessMigration.employeeCount)} />
          </ReviewSection>
        )}
      </div>

      {submitError && <p className={styles.error}>{submitError}</p>}

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onBack}>← Voltar</Button>
        <Button type="button" loading={isSubmitting} onClick={onSubmit}>
          Enviar cadastro →
        </Button>
      </div>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.rows}>{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  )
}
