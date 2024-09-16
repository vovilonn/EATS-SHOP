import { useRouter } from 'next/router'

const similarPages = [
  { route: '/', similar: ['/products/', '/product/[id]'] },
  {
    route: '/profile',
    similar: [
      '/profile/orders',
      '/profile/orders/[id]',
      '/profile/wallet',
      '/profile/achievements',
      '/profile/friends',
      '/profile/personal-info',
    ],
  },
]

const activeLinkUtility = (href: string): boolean => {
  const router = useRouter()
  let result = false

  for (let i = 0; i < similarPages.length; i++) {
    const page = similarPages[i]
    const hasActiveLink = router.asPath === href
    result = hasActiveLink

    if (!hasActiveLink && page.route === href) {
      result = Boolean(
        page.similar.find(route => router.pathname.includes(route))
      )

      break
    }
  }

  return result
}

export default activeLinkUtility
