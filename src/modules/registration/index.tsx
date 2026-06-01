import { useRegistration } from '../../hooks/useRegistration'
import { ProgressBar } from './components/ProgressBar'
import { StepTypeSelector } from './components/StepTypeSelector'
import { StepContact } from './components/StepContact'
import { StepBusinessNew } from './components/StepBusinessNew'
import { StepBusinessMigration } from './components/StepBusinessMigration'
import { StepPlan } from './components/StepPlan'
import { StepReview } from './components/StepReview'
import { StepSuccess } from './components/StepSuccess'
import styles from './Registration.module.css'

export function RegistrationPage() {
  const reg = useRegistration()
  const { state } = reg

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          <span className={styles.kanji}>川</span>
          <div>
            <span className={styles.name}>Kawa</span>
            <span className={styles.sub}>Contabilidade</span>
          </div>
        </a>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <ProgressBar currentStep={state.step} clientType={state.clientType} />

          {state.step === 'type-selector' && (
            <StepTypeSelector onSelect={reg.selectType} />
          )}

          {state.step === 'contact' && (
            <StepContact
              defaultValues={state.contact}
              onSubmit={reg.saveContact}
              onBack={() => reg.goTo('type-selector')}
            />
          )}

          {state.step === 'business-new' && (
            <StepBusinessNew
              defaultValues={state.businessNew}
              defaultPlan={state.selectedPlan}
              onSubmit={(data, plan) => reg.saveBusinessNew(data, plan)}
              onBack={() => reg.goTo('contact')}
            />
          )}

          {state.step === 'business-migration' && (
            <StepBusinessMigration
              defaultValues={state.businessMigration}
              onSubmit={reg.saveBusinessMigration}
              onBack={() => reg.goTo('contact')}
            />
          )}

          {state.step === 'plan' && (
            <StepPlan
              defaultPlan={state.selectedPlan}
              onSubmit={reg.savePlan}
              onBack={() =>
                reg.goTo(state.clientType === 'new' ? 'business-new' : 'business-migration')
              }
            />
          )}

          {state.step === 'review' && (
            <StepReview
              state={state}
              isSubmitting={reg.isSubmitting}
              submitError={reg.submitError}
              onSubmit={reg.submit}
              onBack={() => reg.goTo('plan')}
            />
          )}

          {state.step === 'success' && (
            <StepSuccess
              name={state.contact?.name ?? ''}
              onReset={reg.reset}
            />
          )}
        </div>
      </main>
    </div>
  )
}
