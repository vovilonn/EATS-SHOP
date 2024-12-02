import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'

import style from './style.module.scss'
import AboutUsHeader from './component/header'

const AboutUs: FC = () => {
    return (
        <LoggedLayout>
            <AboutUsHeader />
            <section className={style.wraper}>
                <h1 className={style.title}>Про нас</h1>
                <p className={style.text}>
                    Eats. delivery - найсмачніша доставка
                    їжі у вашому місті!
                </p>
                <p className={style.text}>
                    Ви робите замовлення на сайті, через додаток або по телефону і курʼєр Eats доставляє все з швидкістю смаку за вказаною адресою. Доставка їжі здійснюється
                    максимально швидко за вигідними цінами. Улюблена піца, суші, поке боули, вок, напої та багато іншого готуються з преміум інгредієнтів і з любовʼю для наших клієнтів. Разом з eats.delivery ви отримуєте не лише чудові знижки, а ще й заощаджуйте час і гроші.
                </p>
                <p className={style.text}>
                    Eats.delivery - це найсмачніша доставка у твоєму місті, де можна замовити смачну їжу від брендів Pizzalliano, Ichi, Hawaii, Lap Sha, pure heaven та ін.
                    Нам довіряють користувачі за зручність у використанні, вигідні пропозиції та неймовірну смачну їжу. Замовлення в  Eats.delivery здатні  зробимо Ваш день дійсно смачним.
                </p>
            </section>
        </LoggedLayout>
    )
}

export default AboutUs
