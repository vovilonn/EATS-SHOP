import { FC } from 'react'

import IComponent from '@/shared/interfaces/component.interface'

import Title from '@/shared/components/title'
import ComponentCard from '@/shared/components/component-card'

import style from './style.module.scss'

interface IProductComponentListProps {
  components: IComponent[]
}

const ProductComponentList: FC<IProductComponentListProps> = props => {
  const componentsRendering = props.components.map(component => {
    return <ComponentCard key={component.id} {...component} />
  })

  return (
    <section>
      <Title className={style.title} large>
        Додати складники:
      </Title>
      <div className={style.row}>{componentsRendering}</div>
    </section>
  )
}

export default ProductComponentList
