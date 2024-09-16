import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import SelectInstitutionHeader from './components/header'
import Institution from '@/shared/components/institution'

import style from './style.module.scss'
import Button from '@/shared/components/ui/button'

const SelectInstitutionPageContent: FC = () => {
  return (
    <LoggedLayout>
      <SelectInstitutionHeader />

      <section>
        <div className={style.row}>
          <Institution selected />
          <Institution />
        </div>
        <Button className={style.btn} basket>
          Обрати
        </Button>
      </section>
    </LoggedLayout>
  )
}

export default SelectInstitutionPageContent
