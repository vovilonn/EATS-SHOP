import { FC } from 'react'

interface IMapProps {
  className?: string
}

const Map: FC<IMapProps> = props => (
  <iframe
    className={props.className}
    src='https://www.google.com/maps/embed/v1/place?q=odessa&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'
  ></iframe>
)

export default Map
