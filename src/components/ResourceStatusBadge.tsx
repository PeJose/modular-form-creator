import { Badge } from '../design-system'

interface ResourceStatusBadgeProps {
  variant: 'success' | 'warning'
  children: React.ReactNode
}

export function ResourceStatusBadge({ variant, children }: ResourceStatusBadgeProps) {
  return <Badge variant={variant}>{children}</Badge>
}
