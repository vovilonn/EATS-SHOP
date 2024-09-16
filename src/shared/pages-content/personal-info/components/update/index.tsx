import { FC, useState } from 'react'
import { useMask } from '@react-input/mask'

import FormInput from '@/shared/components/ui/form/form-input'
import FormCheckbox from '@/shared/components/ui/form/form-checkbox'
import Button from '@/shared/components/ui/button'

import style from './style.module.scss'

const PersonalInfoUpdate: FC = () => {
  const optionGenderList = [{ name: 'Чоловік' }, { name: 'Жінка' }]
  const [selectedGender, setGender] = useState<string>(optionGenderList[0].name)

  const dateInputRef = useMask({
    mask: 'дд/мм/рррр',
    replacement: { д: /\d/, м: /\d/, р: /\d/ },
  })

  const renderingOptionGender = optionGenderList.map(gender => {
    const onSelectOption = () => {
      setGender(gender.name)
    }

    const classNameOption = `
      ${style.gender}
      ${selectedGender === gender.name && style.active}
    `

    return (
      <button className={classNameOption} onClick={onSelectOption}>
        {gender.name}
      </button>
    )
  })

  return (
    <form className={style.form} onSubmit={e => e.preventDefault()}>
      <div className={style.fields}>
        <div className={style.field}>
          <label className={style.label} htmlFor='name'>
            Ім’я
          </label>
          <FormInput
            htmlFor='name'
            placeholder='Ім’я'
            onChange={() => {}}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor='email'>
            Пошта
          </label>
          <FormInput
            htmlFor='email'
            placeholder='Пошта'
            onChange={() => {}}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor='phone'>
            Телефон
          </label>
          <FormInput
            htmlFor='phone'
            placeholder='Телефон'
            onChange={() => {}}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor='birth'>
            Дата народження
          </label>
          <FormInput
            reference={dateInputRef}
            htmlFor='birth'
            placeholder='дд/мм/рррр'
            onChange={() => {}}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor='gender'>
            Стать
          </label>

          <div className={style.genders}>{renderingOptionGender}</div>
        </div>
        <div className={style.checkbox}>
          <FormCheckbox onChange={() => {}}>
            Хочу отримувати пропозиції, щодо <br /> новин та акцій
          </FormCheckbox>
        </div>
      </div>

      <Button className={style.btn} basket>
        Зберегти
      </Button>
    </form>
  )
}

export default PersonalInfoUpdate
