import { createFileRoute } from '@tanstack/react-router'
import { DashboardView } from '../components/DashboardView'
import { getDashboard } from '../lib/runs.functions'

export const Route = createFileRoute('/dashboard')({
  loader: () => getDashboard(),
  component: DashboardPage,
})

function DashboardPage() {
  const data = Route.useLoaderData()
  return <DashboardView data={data} />
}

