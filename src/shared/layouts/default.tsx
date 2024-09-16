import { FC, ReactNode } from 'react'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Container from '../components/container'
import Auth from '../components/ui/auth'

interface ILayoutProps {
  children: ReactNode
}

const Layout: FC<ILayoutProps> = props => {
  return (
    <Container>
      <Navbar />
      <main>
        {props.children}
        <Auth />
      </main>
      <Footer />
    </Container>
  )
}

export default Layout
