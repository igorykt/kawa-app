export type ClientType = 'new' | 'migration'

export type BusinessType = 'MEI' | 'ME' | 'EPP'

export type TaxRegime = 'SimplesNacional' | 'LucroPresumido' | 'LucroReal'

export type Plan = 'MEI' | 'Essencial' | 'Profissional'

export interface AddressData {
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  city: string
  state: string
}

export interface NewClientFormData {
  name: string
  email: string
  phone: string
  cpf: string
  desiredBusinessType: BusinessType
  desiredBusinessName: string
  mainActivity: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  city: string
  state: string
  selectedPlan: Plan
}

export interface MigrationClientFormData {
  name: string
  email: string
  phone: string
  cpf: string
  cnpj: string
  companyName: string
  currentTaxRegime: TaxRegime
  currentAccountant: string
  employeeCount: number
  selectedPlan: Plan
}

export type RegistrationFormData = NewClientFormData | MigrationClientFormData

export type Step =
  | 'type-selector'
  | 'contact'
  | 'business-new'
  | 'address'
  | 'business-migration'
  | 'plan'
  | 'review'
  | 'success'

export interface RegistrationState {
  step: Step
  clientType: ClientType | null
  contact: Pick<NewClientFormData, 'name' | 'email' | 'phone' | 'cpf'> | null
  businessNew: Pick<NewClientFormData, 'desiredBusinessType' | 'desiredBusinessName' | 'mainActivity'> | null
  address: AddressData | null
  businessMigration: Pick<MigrationClientFormData, 'cnpj' | 'companyName' | 'currentTaxRegime' | 'currentAccountant' | 'employeeCount'> | null
  selectedPlan: Plan | null
}
