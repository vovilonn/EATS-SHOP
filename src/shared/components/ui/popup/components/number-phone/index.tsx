import { FC, FormEvent, useState } from 'react'
import { MaskEventDetail, useMask } from '@react-input/mask'
import { useDispatch } from 'react-redux'

import { TypeDispatch } from '@/shared/store'

import FormInput from '../../../form/form-input'
import Button from '../../../button'

import style from './style.module.scss'
import { sendNumberCode } from '@/shared/store/auth/requests'

interface IPopupNumberPhoneProps {
  onSubmit: (numberPhone: string) => void
}

const PopupNumberPhone: FC<IPopupNumberPhoneProps> = props => {
  const dispatch = useDispatch<TypeDispatch>()
  const [loading, setLoading] = useState<boolean>(false)
  const [numberPhone, setNumberPhone] = useState<MaskEventDetail | null>(null)

  const phoneInputRef = useMask({
    mask: '+38 ___ ___ __ __',
    replacement: { _: /\d/ },
    onMask: e => {
      setNumberPhone(e.detail)
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!numberPhone?.isValid) return

    try {
      setLoading(true)

      const response = await dispatch(
        sendNumberCode({
          numberPhone: numberPhone.value.replace(/ /g, ''),
        })
      )

      if (response.payload?.status === 'OK') {
        props.onSubmit(numberPhone.value)
      }
    } catch (error) {
      console.log('error =>', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={style.phone} onSubmit={e => onSubmit(e)}>
      <h1 className={style.title}>Ввійдіть в систему</h1>
      <FormInput
        reference={phoneInputRef}
        className={style.input}
        placeholder='+38'
        valid={numberPhone?.isValid}
        large
      />
      <Button
        className={style.btn}
        disabled={!numberPhone?.isValid || loading}
        type='submit'
        basket
        large
      >
        Надіслати код
      </Button>
    </form>
  )
}

export default PopupNumberPhone
