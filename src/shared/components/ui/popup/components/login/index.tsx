import { FC, FormEvent, useState } from 'react'
import useDigitInput from 'react-digit-input'
import { useDispatch } from 'react-redux'

import { login } from '@/shared/store/auth/requests'
import { TypeDispatch } from '@/shared/store'

import FormInput from '../../../form/form-input'
import Button from '../../../button'

import style from './style.module.scss'

interface IPopupLoginProps {
  numberPhone: string
  onSubmit: (userdata: { [key: string]: string }) => void
}

const PopupLogin: FC<IPopupLoginProps> = props => {
  const dispatch = useDispatch<TypeDispatch>()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const digitInput = useDigitInput({
    acceptedCharacters: /\d/,
    length: 4,
    value: code,
    onChange: setCode,
  })

  const isValidCode = !digitInput.map(input => input.value).includes('')
  const firstDigit = digitInput[0]
  const secondDigit = digitInput[1]
  const thirdDigit = digitInput[2]
  const fourthDigit = digitInput[3]

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValidCode) return

    try {
      setLoading(true)

      const response = await dispatch(
        login({
          numberPhone: props.numberPhone.replace(/ /g, ''),
          code: Number(code),
        })
      )

      if (response.payload?.status === 'OK') {
        props.onSubmit(response.payload.data)
      }
    } catch (error) {
      console.log('error =>', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={style.login} onSubmit={e => onSubmit(e)}>
      <p className={style.text}>
        Введіть 4-х значний код, відправлений на номер телефону
      </p>
      <p className={style.number}>{props.numberPhone}</p>
      <button className={style.change} type='button'>
        Змінити номер
      </button>
      <div className={style.row}>
        <FormInput
          digitAttr={firstDigit}
          valid={Boolean(firstDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={secondDigit}
          valid={Boolean(secondDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={thirdDigit}
          valid={Boolean(thirdDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={fourthDigit}
          valid={Boolean(fourthDigit.value)}
          large
          code
        />
      </div>
      <Button
        className={style.btn}
        disabled={!isValidCode || loading}
        type='submit'
        basket
        large
      >
        Продовжити
      </Button>
      <button className={style.again} type='button'>
        Відправити код повторно
      </button>
    </form>
  )
}

export default PopupLogin
