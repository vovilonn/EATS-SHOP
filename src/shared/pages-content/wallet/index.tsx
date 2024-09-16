import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import FormInput from '@/shared/components/ui/form/form-input'
import WalletHeader from './components/header'

import style from './style.module.scss'
import Button from '@/shared/components/ui/button'

const WalletPageContent: FC = () => {
  const classNameForm: string = `${style.form} ${style.error}`

  return (
    <LoggedLayout>
      <WalletHeader />

      <section className={style.wallet}>
        <form className={classNameForm}>
          <FormInput
            placeholder='Введіть суму поповнення'
            onChange={() => {}}
            large
          />
          <span className={style.error}>Поле для вводу порожнє</span>
          <Button className={style.btn} basket>
            Поповнити
          </Button>
        </form>
        <h1 className={style.title}>Історія поповнень</h1>
        <div className={style.history}></div>
      </section>
    </LoggedLayout>
  )
}

export default WalletPageContent
