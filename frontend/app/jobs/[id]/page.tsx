import { redirect } from 'next/navigation'

export default function JobDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/work/jobs/${params.id}`)
}
