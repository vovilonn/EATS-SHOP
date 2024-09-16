import { FC } from 'react'
import { useRouter } from 'next/router'

import Title from '@/shared/components/title'
import Button from '@/shared/components/ui/button'

import style from './style.module.scss'

interface IEmptyCardProps {
  title: string
  text: string
}

const EmptyCard: FC<IEmptyCardProps> = props => {
  const router = useRouter()

  return (
    <div className={style.empty}>
      <Title className={style.title}>{props.title}</Title>
      <p className={style.text}>{props.text}</p>
      <Button className={style.btn} onClick={() => router.push('/')} basket>
        Перейти до меню
      </Button>
    </div>
  )
}

export default EmptyCard
