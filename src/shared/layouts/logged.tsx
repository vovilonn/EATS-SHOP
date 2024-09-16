import { FC, ReactNode } from 'react'

import Container from '@/shared/components/container'
import Navbar from '@/shared/components/navbar'

interface ILoggedLayoutProfile {
  children: ReactNode
}

const LoggedLayout: FC<ILoggedLayoutProfile> = props => {
  return (
    <Container>
      <Navbar />
      <main>{props.children}</main>
    </Container>
  )
}

export default LoggedLayout
