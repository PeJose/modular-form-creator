import type { ResourceStatus } from '../types/resource'
import { Badge } from '../design-system'

interface ResourceStatusBadgeProps {
  status: ResourceStatus
}

export function ResourceStatusBadge({ status }: ResourceStatusBadgeProps) {
  return (
    <Badge variant={status === 'completed' ? 'success' : 'warning'}>
      {status.toUpperCase()}
    </Badge>
  )
}