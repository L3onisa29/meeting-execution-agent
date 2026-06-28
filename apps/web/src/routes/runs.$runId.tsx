import { createFileRoute } from '@tanstack/react-router'
import { RunDetail } from '../components/RunDetail'
import { getRunById } from '../lib/runs.functions'

export const Route = createFileRoute('/runs/$runId')({
  loader: ({ params }) => getRunById({ data: { runId: params.runId } }),
  component: RunDetailPage,
})

function RunDetailPage() {
  const run = Route.useLoaderData()
  return <RunDetail run={run} />
}

