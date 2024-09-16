import { FC, ReactNode } from 'react'

import style from './style.module.scss'

interface IContainerProps {
  children: ReactNode
  className?: string
}

const Container: FC<IContainerProps> = props => {
  const className: string = `${style.container} ${props.className}`

  return <div className={className}>{props.children}</div>
}

export default Container
