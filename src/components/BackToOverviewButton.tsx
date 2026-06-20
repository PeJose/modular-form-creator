import { useNavigate } from 'react-router'
import { Button } from '../design-system'

interface BackToOverviewButtonProps {
  resourceId: string
}

export function BackToOverviewButton({ resourceId }: BackToOverviewButtonProps) {
  const navigate = useNavigate()
  return (
    <Button
      variant="secondary"
      type="button"
      onClick={() => navigate(`/resources/${resourceId}`)}
    >
      Back to Overview
    </Button>
  )
}
