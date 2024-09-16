export const CITY_DATA = [
  { id: 1, name: 'Одеса' },
  { id: 2, name: 'Мукачево' },
]

export const CATEGORY_LIST = [
  {
    id: 1,
    icon: 'https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/pizza.png',
    name: 'Піца',
  },
  {
    id: 2,
    icon: 'https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/sushi.png',
    name: 'Суші',
  },
  {
    id: 3,
    icon: 'https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/burgers.png',
    name: 'Бургери',
  },
  {
    id: 4,
    icon: 'https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/nopoi.png',
    name: 'Нопої',
  },
]

export const BRAND_LIST = [
  {
    id: 1,
    creator_id: 1,
    name: 'Pizza',
    picture: 'https://iili.io/dw2jfku.png',
  },
  {
    id: 2,
    creator_id: 1,
    name: 'Sushi ',
    picture: 'https://iili.io/dw2jK7e.png',
  },
  {
    id: 3,
    creator_id: 1,
    name: 'Pure ',
    picture: 'https://iili.io/dw2hDes.png',
  },
  {
    id: 4,
    creator_id: 1,
    name: 'Havai',
    picture: 'https://iili.io/dw2j9Ll.png',
  },
  {
    id: 5,
    creator_id: 1,
    name: 'Cola',
    picture: 'https://iili.io/dw2hpIf.png',
  },
  {
    id: 6,
    creator_id: 1,
    name: 'Lapsha',
    picture: 'https://iili.io/dw2j2r7.png',
  },
]

export const PRODUCT_LIST = [
  {
    id: 1,
    name: 'Італійська 4',
    composition:
      'соус бешамель, сир моцарела, хрусткий салат, куряче м\'ясо, перепелині яйця, помідори, соус "Цезар" (містить часник), пармезан',
    options: [
      {
        id: 1,
        name: '30 см',
        price: 200,
        weight: 400,
      },
      {
        id: 2,
        name: '40 см',
        price: 320,
        weight: 600,
      },
      {
        id: 3,
        name: '60 см',
        price: 410,
        weight: 600,
      },
    ],
    picture: [
      'https://s3.eu-north-1.amazonaws.com/eats.app/menu/menu_pizza.png',
    ],
    createdAt: 1723718250,
    model_branded_store: {
      id: 1,
      creator_id: 1,
      name: 'Pizzaliano',
      picture:
        'https://s3.eu-north-1.amazonaws.com/eats.app/branded_store/dbb175f0-5890-11ef-b09f-71e3dee58b09.png',
    },
    model_branded_store_categories: {
      id: 1,
      name: 'Італійська',
      branded_store_id: 1,
    },
    model_general_categories: {
      id: 1,
      icon: 'https://s3.eu-north-1.amazonaws.com/eats.app/general_categories/pizza.png',
      name: 'Піца',
    },
    model_additional_components: [
      {
        id: 1,
        branded_store: 1,
        name: 'Сир моцарела',
        price: 23,
        picture:
          'https://s3.eu-north-1.amazonaws.com/eats.app/ingredients/img.png',
        options: '50 г',
      },
      {
        id: 2,
        branded_store: 1,
        name: 'Шинка королівська',
        price: 19,
        picture:
          'https://s3.eu-north-1.amazonaws.com/eats.app/ingredients/img-1.png',
        options: '50 г',
      },
      {
        id: 3,
        branded_store: 1,
        name: 'Бекон',
        price: 19,
        picture:
          'https://s3.eu-north-1.amazonaws.com/eats.app/ingredients/img-2.png',
        options: '50 г',
      },
    ],
    is_favorite: false,
  },
]

export const FILTER_LIST = [
  {
    id: 1,
    name: 'Італійська',
  },
  {
    id: 2,
    name: 'Мексиканська',
  },
  {
    id: 3,
    name: 'Грибна',
  },
]

export const ORDER_LIST = [
  {
    id: 1,
    title: 'Замовлення №1',
    status: 'Створено',
    date: 'черв. 08, 2024 18:12',
    address: 'м. Ужгород, вул Минайська 7а',
    price: 495,
    picture: [
      'https://s3.eu-north-1.amazonaws.com/eats.app/menu/menu_pizza.png',
      'https://s3.eu-north-1.amazonaws.com/eats.app/menu/menu_pizza.png',
      'https://s3.eu-north-1.amazonaws.com/eats.app/menu/menu_pizza.png',
    ],
  },
]
