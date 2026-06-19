import { useParams } from 'react-router'
import { useResource } from '../hooks/useResource'
import { ResourceStatusBadge } from '../components/ResourceStatusBadge'
import { Card } from '../design-system'
import { Button } from '../design-system'
import styled from 'styled-components'

const OverviewContainer = styled.div`
  padding: 20px;
  max-width: 800px;
`

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`

const ProgressSection = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
`

const ModuleProgressTitle = styled.h3`
  margin-bottom: 12px;
`

const ModuleProgress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .module-name {
    font-weight: bold;
  }

  .module-status {
    font-size: 0.9em;
  }
`

function ResourceOverview() {
  const { resourceId } = useParams()
  const { resource, isLoading, error, provisionResource } = useResource(
    resourceId as string,
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const isBasicInfoComplete = Boolean(
    resource.basicInfo?.resourceName &&
    resource.basicInfo?.owner &&
    resource.basicInfo?.email &&
    resource.basicInfo?.description &&
    resource.basicInfo?.priority,
  )

  const isProjectDetailsComplete = Boolean(
    resource.projectDetails?.projectName &&
    resource.projectDetails?.budget &&
    resource.projectDetails?.category &&
    resource.projectDetails?.options?.length > 0,
  )

  const canProvision =
    resource.status === 'draft' && isBasicInfoComplete && isProjectDetailsComplete

  const handleProvision = async () => {
    await provisionResource()
  }

  return (
    <OverviewContainer>
      <Card>
        <InfoSection>
          <h1>{resource.name}</h1>
          <ResourceStatusBadge
            variant={resource.status === 'completed' ? 'success' : 'warning'}
          >
            {resource.status.toUpperCase()}
          </ResourceStatusBadge>
        </InfoSection>

        <ProgressSection>
          <ModuleProgressTitle>Module Progress</ModuleProgressTitle>
          <ModuleProgress>
            <span className="module-name">Basic Info</span>
            <span className="module-status">
              {isBasicInfoComplete ? 'Complete' : 'Incomplete'}
            </span>
          </ModuleProgress>
          <ModuleProgress>
            <span className="module-name">Project Details</span>
            <span className="module-status">
              {isProjectDetailsComplete ? 'Complete' : 'Incomplete'}
            </span>
          </ModuleProgress>
        </ProgressSection>

        {resource.status === 'draft' && (
          <Button
            onClick={handleProvision}
            disabled={!canProvision}
            variant={canProvision ? 'primary' : 'secondary'}
          >
            Provision
          </Button>
        )}
      </Card>
    </OverviewContainer>
  )
}

export default ResourceOverview
