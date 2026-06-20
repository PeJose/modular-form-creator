import { Link, useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { ResourceStatusBadge } from '../components/ResourceStatusBadge'
import { PendingBadge } from '../components/PendingBadge'
import { Card } from '../design-system'
import { Button } from '../design-system'
import styled from 'styled-components'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceService } from '../services/resourceService'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../utils/moduleHelpers'

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
  const queryClient = useQueryClient()
  const { resource, isLoading, error, provisionResource } = useResource(
    resourceId as string,
  )
  const buffer = useResourceEditBuffer()
  const bufferData = buffer.getBuffer(resourceId)

  const hasPendingChanges = Boolean(bufferData?.basicInfo || bufferData?.projectDetails)

  const effectiveBasicInfo = bufferData?.basicInfo || resource?.basicInfo
  const effectiveProjectDetails = bufferData?.projectDetails || resource?.projectDetails

  const basicInfoComplete = isBasicInfoComplete(effectiveBasicInfo)
  const projectDetailsComplete = isProjectDetailsComplete(effectiveProjectDetails)

  const canProvision =
    resource?.status === 'draft' && basicInfoComplete && projectDetailsComplete

  const handleProvision = async () => {
    await provisionResource()
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: resource!.name,
        basicInfo: bufferData?.basicInfo || resource!.basicInfo!,
        projectDetails: bufferData?.projectDetails || resource!.projectDetails!,
      }
      return resourceService.fullUpdateResource(resourceId!, payload)
    },
    onSuccess: () => {
      buffer.clearBuffer(resourceId!)
      queryClient.invalidateQueries({ queryKey: ['resources', resourceId] })
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const hasBufferedBasicInfo = Boolean(bufferData?.basicInfo)
  const hasBufferedProjectDetails = Boolean(bufferData?.projectDetails)

  return (
    <Card>
      <InfoSection>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="secondary" size="small" onClick={() => navigate('/resources')}>
            ← Back to Resources
          </Button>
          <Link to={`/resources/${resource._id}/details`}>
            <Button variant="secondary" size="small">
              View Details →
            </Button>
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1>{resource.name}</h1>
          <ResourceStatusBadge status={resource.status} />
        </div>
      </InfoSection>

      <ProgressSection>
        <ModuleProgressTitle>Module Progress</ModuleProgressTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ModuleProgress>
            <span className="module-name">Basic Info</span>
            <ModuleProgressActions>
              <span className="module-status">
                {basicInfoComplete ? 'Complete' : 'Incomplete'}
              </span>
              {hasBufferedBasicInfo && <PendingBadge>Pending</PendingBadge>}
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
                {projectDetailsComplete ? 'Complete' : 'Incomplete'}
              </span>
              {hasBufferedProjectDetails && <PendingBadge>Pending</PendingBadge>}
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

      {resource.status === 'completed' && hasPendingChanges && (
        <div style={{ marginTop: '16px' }}>
          <Button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending}
            variant="primary"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Pending Changes'}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ResourceOverview