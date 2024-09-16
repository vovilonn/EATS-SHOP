import { FC, useState } from 'react'
import Link from 'next/link'

import optionsRenderingUtility from '@/shared/utils/options-rendering.utility'

import Institution from '@/shared/components/institution'
import Button from '@/shared/components/ui/button'
import FormInput from '@/shared/components/ui/form/form-input'
import Map from '@/shared/components/map'
import FormCheckbox from '@/shared/components/ui/form/form-checkbox'

import style from './style.module.scss'

const OrderConfirmForm: FC = () => {
  const deliveryList = [{ name: 'Доставка' }, { name: 'Самовивіз' }]
  const [selectedOption, setOption] = useState<string>('Доставка')

  const onSelectOption = (option: any) => {
    setOption(option.name)
  }

  const optionsDeliveryRendering = optionsRenderingUtility({
    style,
    options: deliveryList,
    onSelectOption,
    selectedOption,
  })

  return (
    <form className={style.form}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
        <div className={style.tabs}>{optionsDeliveryRendering}</div>
        <div className={style.address}>
          <div className={style.field}>
            <label className={style.label} htmlFor='address'>
              Адрес доставки
            </label>
            <FormInput
              className={style.input}
              htmlFor='address'
              onChange={() => {}}
              large
            />
          </div>
          <Button className={style.select} basket>
            Обрати на карті
          </Button>
          <div className={style.map}>
            <Link className={style.change} href=''>
              Змінити адрес
            </Link>
            <Map className={style.iframe} />
            <div className={style.detailed}>
              <div className={style.field}>
                <label className={style.label} htmlFor='approach'>
                  Під’їзд
                </label>
                <FormInput
                  className={style.input}
                  htmlFor='approach'
                  onChange={() => {}}
                  large
                />
              </div>
              <div className={style.field}>
                <label className={style.label} htmlFor='floor'>
                  Поверх
                </label>
                <FormInput
                  className={style.input}
                  htmlFor='floor'
                  onChange={() => {}}
                  large
                />
              </div>
              <div className={style.field}>
                <label className={style.label} htmlFor='apartment'>
                  Квартира
                </label>
                <FormInput
                  className={style.input}
                  htmlFor='apartment'
                  onChange={() => {}}
                  large
                />
              </div>
            </div>
          </div>
          <div className={style.institution}>
            <Button className={style.select} basket>
              Обрати заклад
            </Button>
            <Link className={style.change} href=''>
              Змінити адрес
            </Link>
            <Institution />
          </div>
        </div>
        <div className={style.call}>
          <FormCheckbox onChange={() => {}} large>
            Не передзвонювати
          </FormCheckbox>
        </div>
        <div className={style.payment}>
          <h2 className={style.title}>Спосіб оплати</h2>
          <FormCheckbox onChange={() => {}} large>
            Готівка
          </FormCheckbox>
          <FormCheckbox className={style.cart} onChange={() => {}} large>
            Карткою онлайн
          </FormCheckbox>
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor='ready'>
            Підготувати решту з
          </label>
          <FormInput
            className={style.input}
            htmlFor='ready'
            onChange={() => {}}
            large
          />
        </div>
      </div>
      <div className={style.comment}>
        <h1 className={style.title}>Коментар</h1>
        <textarea className={style.textarea}></textarea>
        <div className={style.coin}>
          <p className={style.label}>У вас 100 eatscoin</p>

          <div className={style.activate}>
            <input className={style.input} type='text' placeholder='Промокод' />
            <button className={style.btn}>Активувати</button>
          </div>
          <div className={style.activate}>
            <input
              className={style.input}
              type='text'
              placeholder='Бонусні eatscoin'
            />
            <button className={style.btn}>Активувати</button>
          </div>
        </div>
        <div className={style.info}>
          <div className={style.list}>
            <p className={style.text}>
              <span>Вартість замовлення</span>
              <span>595 грн</span>
            </p>
            <p className={style.text}>
              <span>Використані eatscoin</span>
              <span>0 e</span>
            </p>
            <p className={style.text}>
              <span>Знижка</span>
              <span>0 грн</span>
            </p>
            <p className={style.text}>
              <span>Вартість доставки</span>
              <span>60 грн</span>
            </p>
          </div>

          <p className={style.total}>
            <span>Загальна вартість</span>
            <span>595 грн</span>
          </p>
        </div>
        <Button className={style.checkout} basket>
          Оформити
        </Button>
      </div>
    </form>
  )
}

export default OrderConfirmForm
