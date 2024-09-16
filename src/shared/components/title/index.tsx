import { FC, ReactNode } from 'react'
import Image from 'next/image'

import style from './style.module.scss'

interface ITitleProps {
  children: ReactNode
  className?: string
  large?: boolean
  icon?: string
}

const Title: FC<ITitleProps> = props => {
  const icon = props.icon || ''
  const classNameTitle: string = `
    ${style.title}
    ${props.className}
    ${props.large && style.large}
  `

  return (
    <h1 className={classNameTitle}>
      {props.icon && (
        <span className={style.icon}>
          <Image width='40' height='34' src={icon} alt='title icon' />
        </span>
      )}
      {props.children}
    </h1>
  )
}

export default Title
