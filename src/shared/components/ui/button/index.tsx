import { FC, ReactNode } from 'react'

import style from './style.module.scss'

interface IButtonProps {
  children: ReactNode
  view?: boolean
  basket?: boolean
  large?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const Button: FC<IButtonProps> = props => {
  const className: string = `
    ${style.button}
    ${props.className}
    ${props.view && style.view}
    ${props.basket && style.basket}
    ${props.large && style.large}
  `

  return (
    <button
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.children}
    </button>
  )
}

export default Button
