interface ITotalPriceUtilityProps {
  price: number
  amount?: number
}

const totalPriceUtility = (props: ITotalPriceUtilityProps) => {
  return props.amount ? props.price * props.amount : props.price
}

export default totalPriceUtility
