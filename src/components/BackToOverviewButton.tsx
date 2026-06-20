import { useNavigate } from 'react-router'
import { Button } from '../design-system'

interface BackToOverviewButtonProps {
  resourceId: string
  label?: string
}

export function BackToOverviewButton({ resourceId, label = 'Back to Overview' }: BackToOverviewButtonProps) {
  const navigate = useNavigate()
  return (
    <Button variant="secondary" type="button" onClick={() => navigate(`/resources/${resourceId}`)}>
      {label}
    </Button>
  )
}