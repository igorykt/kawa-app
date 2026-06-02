import axios from 'axios'
import type { MigrationClientFormData, NewClientFormData } from '../types/registration'

const api = axios.create({ baseURL: '/api' })

export const registrationService = {
  registerNew: (data: NewClientFormData) =>
    api.post('/clients/new', {
      ...data,
      desiredBusinessType: businessTypeToInt(data.desiredBusinessType),
      cep: data.cep.replace(/\D/g, ''),
    }),

  registerMigration: (data: MigrationClientFormData) =>
    api.post('/clients/migration', {
      ...data,
      currentTaxRegime: taxRegimeToInt(data.currentTaxRegime),
      cnpj: data.cnpj.replace(/\D/g, ''),
    }),

  captureLead: (data: { name: string; email: string; phone: string }) =>
    api.post('/leads', data),
}

function businessTypeToInt(type: string): number {
  return { MEI: 1, ME: 2, EPP: 3 }[type] ?? 1
}

function taxRegimeToInt(regime: string): number {
  return { SimplesNacional: 1, LucroPresumido: 2, LucroReal: 3 }[regime] ?? 1
}
