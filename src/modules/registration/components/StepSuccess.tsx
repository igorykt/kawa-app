import { Button } from '../../../components/ui/Button'
import styles from './StepSuccess.module.css'

interface Props {
  name: string
  onReset: () => void
}

export function StepSuccess({ name, onReset }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>✓</div>
      <h2 className={styles.title}>Cadastro enviado!</h2>
      <p className={styles.message}>
        Olá, <strong>{name.split(' ')[0]}</strong>! Recebemos seu cadastro com sucesso.
        Em breve nossa equipe entrará em contato pelo e-mail e telefone informados.
      </p>
      <p className={styles.sub}>Fique de olho na sua caixa de entrada.</p>
      <Button variant="outline" onClick={onReset}>Fazer novo cadastro</Button>
    </div>
  )
}
