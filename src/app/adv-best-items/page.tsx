export const dynamic = 'force-dynamic'

import StackContainer from '@/app/shared/components/StackContainer'

interface PageProps {
  searchParams: Promise<{ [key: string]: string }>
}

export default function Page({ searchParams }: PageProps) {
  return <StackContainer path="adv-best-items" searchParams={searchParams} />
}
