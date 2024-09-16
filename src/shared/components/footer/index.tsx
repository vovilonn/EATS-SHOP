import { FC } from 'react'
import Link from 'next/link'

import LogoIcon from '@/shared/assets/icons/logo-icon.svg'
import AppleIcon from '@/shared/assets/icons/apple-icon.svg'
import MasterCardIcon from '@/shared/assets/icons/mastercard-icon.svg'
import VisaIcon from '@/shared/assets/icons/visa-icon.svg'
import PhoneIcon from '@/shared/assets/icons/phone-icon.svg'
import InstagramIcon from '@/shared/assets/icons/instagram-icon.svg'
import TiktokIcon from '@/shared/assets/icons/tiktok-icon.svg'
import CopyRight from '@/shared/assets/icons/copyright-icon.svg'

import style from './style.module.scss'

const Footer: FC = () => {
  return (
    <footer className={ style.footer }>
      <section className={ style.footerPc }>
        <div className={ style.row }>
          <article className={ style.item }>
            <LogoIcon className={ style.logo } />

            <a className={ style.store } href='/'>
              <AppleIcon className={ style.icon } />
              <span className={ style.text }>Download on the</span>
              <span className={ style.title }>App Store</span>
            </a>

            <div className={ style.cards }>
              <MasterCardIcon className={ style.card } />
              <VisaIcon className={ style.card } />
            </div>
          </article>
          <article className={ style.nav }>
            <h6 className={ style.title }>Навігація:</h6>
            <nav className={ style.list }>
              <Link className={ style.link } href='/'>
                Замовлення
              </Link>
              <Link className={ style.link } href='/'>
                Гаманець
              </Link>
              <Link className={ style.link } href='/'>
                Досягнення
              </Link>
              <Link className={ style.link } href='/'>
                Друзі
              </Link>
              <Link className={ style.link } href='/'>
                Про нас
              </Link>
              <Link className={ style.link } href='/'>
                Налаштування
              </Link>
              <Link className={ style.link } href='/'>
                Правові документи
              </Link>
            </nav>
          </article>
          <article className={ style.time }>
            <h6 className={ style.title }>Час роботи:</h6>
            <p className={ style.text }>з 11:00 до 22:00</p>
          </article>
          <article className={ style.cities }>
            <h6 className={ style.title }>Міста:</h6>
            <div className={ style.list }>
              <p className={ style.text }>Одеса</p>
              <p className={ style.text }>Одеса</p>
              <p className={ style.text }>Одеса</p>
              <p className={ style.text }>Одеса</p>
            </div>
          </article>
          <article className={ style.socials }>
            <a className={ style.phone } href='tel:050 72 38 600'>
              <PhoneIcon className={ style.icon } />
              <span className={ style.text }>Гаряча лінія</span>
              <span className={ style.title }>050 72 38 600</span>
            </a>
            <a className={ style.social } href='/'>
              <InstagramIcon className={ style.icon } />
              Instagram
            </a>
            <a className={ style.social } href='/'>
              <TiktokIcon className={ style.icon } />
              TikTok
            </a>
          </article>
        </div>

        <div className={ style.rights }>
          <p className={ style.copy }>
            <CopyRight />
            eats. All rights reserved.
          </p>
          <a className={ style.politics } href='/'>
            Політика конфіденційності
          </a>
        </div>
      </section>

      <section className={ style.footerMobile }>
        <div className={ style.mediaRow }>
          <LogoIcon className={ style.logo } />
          <a className={ style.store } href='/'>
            <AppleIcon className={ style.icon } />
            <span className={ style.text }>Download on the</span>
            <span className={ style.title }>App Store</span>
          </a>
        </div>
        <div 
        className={ style.mediaRow }>
          <article className={ style.nav }>
            <h6 className={ style.title }>Навігація:</h6>
            <nav className={ style.list }>
              <Link className={ style.link } href='/'>
                Замовлення
              </Link>
              <Link className={ style.link } href='/'>
                Гаманець
              </Link>
              <Link className={ style.link } href='/'>
                Досягнення
              </Link>
              <Link className={ style.link } href='/'>
                Друзі
              </Link>
              <Link className={ style.link } href='/'>
                Про нас
              </Link>
              <Link className={ style.link } href='/'>
                Налаштування
              </Link>
              <Link className={ style.link } href='/'>
                Правові документи
              </Link>
            </nav>
          </article>

          <div className={ style.citiesAndTimeRow }>
            <article className={ style.cities }>
              <h6 className={ style.title }>Міста:</h6>
              <div className={ style.list }>
                <p className={ style.text }>Одеса</p>
                <p className={ style.text }>Одеса</p>
                <p className={ style.text }>Одеса</p>
                <p className={ style.text }>Одеса</p>
              </div>
            </article>
            <article className={ style.time }>
              <h6 className={ style.title }>Час роботи:</h6>
              <p className={ style.text }>з 11:00 до 22:00</p>
            </article>
          </div>
        </div>
          <article className={ style.socials }>
            <a className={ style.phone } href='tel:050 72 38 600'>
              <PhoneIcon className={ style.icon } />
              <span className={ style.text }>Гаряча лінія</span>
              <span className={ style.title }>050 72 38 600</span>
            </a>
            <a className={ style.social } href='/'>
              <InstagramIcon className={ style.icon } />
              Instagram
            </a>
            <a className={ style.social } href='/'>
              <TiktokIcon className={ style.icon } />
              TikTok
            </a>
          </article>

          <div className={ style.rightsMobile }>
          <a className={ style.politics } href='/'>
            Політика конфіденційності
          </a>
          <div className={ style.cards }>
              <MasterCardIcon className={ style.card } />
              <VisaIcon className={ style.card } />
            </div>
          <div className={ style.copy }>
            <CopyRight />
            <p>
              eats. All rights reserved.
            </p>
          </div>
        </div>

        

      </section>

    </footer>
  )
}

export default Footer
