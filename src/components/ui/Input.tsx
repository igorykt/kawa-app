import { forwardRef } from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')

    return (
      <div className={styles.wrapper}>
        <label htmlFor={inputId} className={styles.label}>{label}</label>
        <input
          id={inputId}
          ref={ref}
          className={`${styles.input} ${error ? styles.hasError : ''}`}
          {...props}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    )
  }
)
