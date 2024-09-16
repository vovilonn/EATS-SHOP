export default interface IOrder {
  id: number
  title: string
  status: string
  date: string
  address: string
  picture: Array<string>
  price: number
}
