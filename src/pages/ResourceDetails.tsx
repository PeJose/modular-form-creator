import { useParams, useNavigate } from 'react-router'
import { Button } from '../design-system'
import { Card } from '../design-system'
import styled from 'styled-components'

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

function ResourceDetails() {
  const { resourceId } = useParams()
  const navigate = useNavigate()

  return (
    <Card>
      <HeaderSection>
        <h1>Resource Details</h1>
        <Button variant="secondary" onClick={() => navigate(`/resources/${resourceId}`)}>
          Back to Overview
        </Button>
      </HeaderSection>
      <p>Summary view of both modules - Coming soon</p>
    </Card>
  )
}

export default ResourceDetails
