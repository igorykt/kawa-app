import type { ClientType } from '../../../types/registration'
import styles from './StepTypeSelector.module.css'

interface Props {
  onSelect: (type: ClientType) => void
}

export function StepTypeSelector({ onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Como podemos te ajudar?</h2>
      <p className={styles.subtitle}>Selecione o perfil que melhor descreve a sua situação.</p>

      <div className={styles.cards}>
        <button className={styles.card} onClick={() => onSelect('new')}>
          <div className={styles.icon}>🚀</div>
          <h3>Quero abrir minha empresa</h3>
          <p>Ainda não tenho CNPJ. Quero abrir meu negócio do zero com apoio completo.</p>
          <ul className={styles.features}>
            <li>✓ Abertura de MEI, ME ou EPP</li>
            <li>✓ CNPJ gratuito nos planos anuais</li>
            <li>✓ Suporte desde o início</li>
          </ul>
          <span className={styles.cta}>Começar →</span>
        </button>

        <button className={styles.card} onClick={() => onSelect('migration')}>
          <div className={styles.icon}>🔄</div>
          <h3>Já tenho empresa e quero migrar</h3>
          <p>Já possuo CNPJ ativo e quero trocar para uma contabilidade melhor.</p>
          <ul className={styles.features}>
            <li>✓ Migração sem burocracia</li>
            <li>✓ Assumimos toda a documentação</li>
            <li>✓ Sem interrupção nos serviços</li>
          </ul>
          <span className={styles.cta}>Migrar →</span>
        </button>
      </div>
    </div>
  )
}
