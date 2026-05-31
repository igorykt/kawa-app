import { useState } from 'react'
import type {
  ClientType,
  MigrationClientFormData,
  NewClientFormData,
  Plan,
  RegistrationState,
  Step,
} from '../types/registration'
import { registrationService } from '../services/registrationService'

const VALID_PLANS: Plan[] = ['MEI', 'Essencial', 'Profissional']

function readPlanFromUrl(): Plan | null {
  const param = new URLSearchParams(window.location.search).get('plan')
  return VALID_PLANS.includes(param as Plan) ? (param as Plan) : null
}

function buildInitialState(): RegistrationState {
  const planFromUrl = readPlanFromUrl()
  return {
    step: 'type-selector',
    clientType: null,
    contact: null,
    businessNew: null,
    businessMigration: null,
    selectedPlan: planFromUrl,
  }
}

export function useRegistration() {
  const [state, setState] = useState<RegistrationState>(buildInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const goTo = (step: Step) => setState(s => ({ ...s, step }))

  const selectType = (clientType: ClientType) => {
    setState(s => ({ ...s, clientType, step: 'contact' }))
  }

  const saveContact = (contact: RegistrationState['contact']) => {
    setState(s => ({
      ...s,
      contact,
      step: s.clientType === 'new' ? 'business-new' : 'business-migration',
    }))
  }

  const saveBusinessNew = (businessNew: RegistrationState['businessNew']) => {
    setState(s => ({
      ...s,
      businessNew,
      step: s.selectedPlan ? 'review' : 'plan',
    }))
  }

  const saveBusinessMigration = (businessMigration: RegistrationState['businessMigration']) => {
    setState(s => ({
      ...s,
      businessMigration,
      step: s.selectedPlan ? 'review' : 'plan',
    }))
  }

  const savePlan = (selectedPlan: Plan) => {
    setState(s => ({ ...s, selectedPlan, step: 'review' }))
  }

  const submit = async () => {
    if (!state.contact || !state.selectedPlan || !state.clientType) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (state.clientType === 'new' && state.businessNew) {
        const payload: NewClientFormData = {
          ...state.contact,
          ...state.businessNew,
          selectedPlan: state.selectedPlan,
        }
        await registrationService.registerNew(payload)
      } else if (state.clientType === 'migration' && state.businessMigration) {
        const payload: MigrationClientFormData = {
          ...state.contact,
          ...state.businessMigration,
          selectedPlan: state.selectedPlan,
        }
        await registrationService.registerMigration(payload)
      }

      setState(s => ({ ...s, step: 'success' }))
    } catch (err: unknown) {
      const message =
        axios_getError(err) ?? 'Erro ao enviar cadastro. Tente novamente.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    window.history.replaceState({}, '', window.location.pathname)
    setState(buildInitialState())
  }

  return {
    state,
    isSubmitting,
    submitError,
    selectType,
    saveContact,
    saveBusinessNew,
    saveBusinessMigration,
    savePlan,
    submit,
    goTo,
    reset,
  }
}

function axios_getError(err: unknown): string | null {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response
    return res?.data?.error ?? null
  }
  return null
}
