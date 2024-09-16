import { FC, ReactNode } from 'react'

import CheckedIcon from '@/shared/assets/icons/checked-icon.svg'

import style from './style.module.scss'

interface IFormCheckboxProps {
  children: ReactNode
  onChange: (checked: boolean) => void
  className?: string
  large?: boolean
}

const FormCheckbox: FC<IFormCheckboxProps> = props => {
  const htmlFor: string = Math.random().toString()
  const classNameWraper: string = `
    ${style.wraper}
    ${props.className}
    ${props.large && style.large}
  `

  return (
    <label className={classNameWraper} htmlFor={htmlFor}>
      <span className={style.label}>{props.children}</span>
      <input className={style.checkbox} id={htmlFor} type='checkbox' />
      <span className={style.checked}>
        <CheckedIcon className={style.icon} />
      </span>
    </label>
  )
}

export default FormCheckbox
