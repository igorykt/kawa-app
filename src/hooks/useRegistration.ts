import { useState } from 'react'
import type {
  AddressData,
  ClientType,
  MigrationClientFormData,
  NewClientFormData,
  Plan,
  RegistrationState,
  Step,
} from '../types/registration'
import type { MigrationContactData } from '../modules/registration/components/StepMigrationContact'
import { registrationService } from '../services/registrationService'

const VALID_PLANS: Plan[] = ['MEI', 'Essencial', 'Profissional']

function readPlanFromUrl(): Plan | null {
  const param = new URLSearchParams(window.location.search).get('plan')
  return VALID_PLANS.includes(param as Plan) ? (param as Plan) : null
}

function readTypeFromUrl(): ClientType | null {
  const param = new URLSearchParams(window.location.search).get('type')
  return param === 'new' ? 'new' : param === 'migration' ? 'migration' : null
}

function buildInitialState(): RegistrationState {
  const planFromUrl = readPlanFromUrl()
  const typeFromUrl = readTypeFromUrl()
  const clientType = typeFromUrl ?? (planFromUrl ? 'new' : null)
  return {
    step: clientType ? 'contact' : 'type-selector',
    clientType,
    contact: null,
    businessNew: null,
    address: null,
    businessMigration: null,
    selectedPlan: planFromUrl,
  }
}

export function useRegistration() {
  const [state, setState] = useState<RegistrationState>(buildInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const goTo = (step: Step) => setState(s => ({ ...s, step }))

  const goToTypeSelector = () =>
    setState(s => ({ ...s, step: 'type-selector', clientType: null }))

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

  const saveBusinessNew = (businessNew: RegistrationState['businessNew'], selectedPlan: Plan) => {
    setState(s => ({
      ...s,
      businessNew,
      selectedPlan,
      step: 'address',
    }))
  }

  const saveAddress = (address: AddressData) => {
    setState(s => ({ ...s, address, step: 'review' }))
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

  const submitMigrationLead = async (data: MigrationContactData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await registrationService.captureLead(data)
      setState(s => ({ ...s, contact: { ...data, cpf: '' }, step: 'success' }))
    } catch {
      setSubmitError('Erro ao enviar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submit = async () => {
    if (!state.contact || !state.selectedPlan || !state.clientType) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (state.clientType === 'new' && state.businessNew && state.address) {
        const payload: NewClientFormData = {
          ...state.contact,
          ...state.businessNew,
          ...state.address,
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
    saveAddress,
    saveBusinessMigration,
    savePlan,
    submit,
    submitMigrationLead,
    goTo,
    goToTypeSelector,
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
