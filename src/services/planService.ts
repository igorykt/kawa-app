import axios from 'axios'

export interface PlanConfig {
  id: string
  name: string
  legalType: string
  price: number
  revenue: string
  employees: string
  forWhom: string
  pros: string[]
  cons: string[]
  isActive: boolean
  displayOrder: number
}

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

export const planService = {
  getActive: (): Promise<PlanConfig[]> =>
    api.get<PlanConfig[]>('/plans', { params: { activeOnly: true } }).then(r => r.data),
}
