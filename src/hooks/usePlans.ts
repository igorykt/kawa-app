import { useEffect, useState } from 'react'
import { planService, type PlanConfig } from '../services/planService'

export function usePlans() {
  const [plans, setPlans] = useState<PlanConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    planService.getActive()
      .then(setPlans)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { plans, loading, error }
}
