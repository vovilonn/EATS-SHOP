import { FC, ReactNode } from 'react'

import style from './style.module.scss'

interface IBreadcrumbsProps {
  children: ReactNode
  className?: string
}

const Breadcrumbs: FC<IBreadcrumbsProps> = props => {
  const className: string = `${style.breadcrumbs} ${props.className}`

  return <nav className={className}>{props.children}</nav>
}

export default Breadcrumbs
