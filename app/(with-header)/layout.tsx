import { Header } from '@/components/layout/Header'

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
