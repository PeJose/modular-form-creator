import { Link, useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { ResourceStatusBadge } from '../components/ResourceStatusBadge'
import { Card } from '../design-system'
import { Button } from '../design-system'
import styled from 'styled-components'

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
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

const ModuleProgressActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

function ResourceOverview() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
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
    <Card>
      <InfoSection>
        <Button variant="secondary" size="small" onClick={() => navigate('/resources')}>
          ← Back to Resources
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1>{resource.name}</h1>
          <ResourceStatusBadge
            variant={resource.status === 'completed' ? 'success' : 'warning'}
          >
            {resource.status.toUpperCase()}
          </ResourceStatusBadge>
        </div>
      </InfoSection>

      <ProgressSection>
        <ModuleProgressTitle>Module Progress</ModuleProgressTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ModuleProgress>
            <span className="module-name">Basic Info</span>
            <ModuleProgressActions>
              <span className="module-status">
                {isBasicInfoComplete ? 'Complete' : 'Incomplete'}
              </span>
              <Link to={`/resources/${resource._id}/basic-info`}>
                <Button variant="secondary" size="small">
                  Edit
                </Button>
              </Link>
            </ModuleProgressActions>
          </ModuleProgress>

          <ModuleProgress>
            <span className="module-name">Project Details</span>
            <ModuleProgressActions>
              <span className="module-status">
                {isProjectDetailsComplete ? 'Complete' : 'Incomplete'}
              </span>
              <Link to={`/resources/${resource._id}/project-details`}>
                <Button variant="secondary" size="small">
                  Edit
                </Button>
              </Link>
            </ModuleProgressActions>
          </ModuleProgress>
        </div>
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
  )
}

export default ResourceOverview
