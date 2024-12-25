import { FC } from 'react'

import LoggedLayout from '@/shared/layouts/logged'
import AboutUsHeader from './component/header'

import style from './style.module.scss'

const AboutUs: FC = () => {
    return (
        <LoggedLayout>
            <AboutUsHeader />
            <section className={style.wraper}>
                <h1 className={style.title}>
                    EATS - це зручний сервіс доставки улюбленої їжі у вашому місті! Замовляйте піцу, суші, боули, вок та багато інших страв в один клік.
                </h1>
                <p className={style.text}>
                    - обирайте страви серед брендів представлених у нашому сервісі<br/>
                    - збільшуйте рівень клієнта та отримуй кешбек з кожного замовлення<br/>
                    - запрошуйте друзів та разом<br/>
                    - отримуйте бонуси<br/>
                    - збирайте досягнення<br/>
                    - використовуйте промокоди<br/>
                    - додавайте страви в улюблене<br/>
                    - отримуйте неперевершені гастрономічні враження!
                </p>
                <p className={style.text}>
                    Завантажуйте наш мобільний додаток і насолоджуйтеся найзручнішим способом замовлення їжі!
                </p>
                <h2 className={style.title}>Чому обирають нас?</h2>
                <ul className={style.text}>
                    <li>• Широке меню. Від класичних страв до ексклюзивних позицій, які задовольнять будь-які смаки.</li>
                    <li>• Швидка доставка. Отримуйте гарячу й свіжу їжу в найкоротші терміни.</li>
                    <li>• Зручність у кожній деталі.</li>
                    <li>• Повторюйте улюблені замовлення за кілька секунд та відстежуйте статус вашого замовлення.</li>
                    <li>• Акції та знижки. Дізнавайтеся першими про вигідні пропозиції та заощаджуйте!</li>
                </ul>
                <p className={style.text}>
                    Ваш улюблений смак – у вашому смартфоні! Смакуйте з комфортом!
                </p>
            </section>
        </LoggedLayout>
    )
}

export default AboutUs
