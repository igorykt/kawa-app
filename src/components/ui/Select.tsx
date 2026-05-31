import styles from './Select.module.css'

interface SelectOption { value: string; label: string }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, options, error, id, ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s/g, '-')

  return (
    <div className={styles.wrapper}>
      <label htmlFor={selectId} className={styles.label}>{label}</label>
      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.hasError : ''}`}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
