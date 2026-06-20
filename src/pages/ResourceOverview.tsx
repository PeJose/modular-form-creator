import { Link, useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { ResourceStatusBadge } from '../components/ResourceStatusBadge'
import { Card } from '../design-system'
import { Button } from '../design-system'
import styled from 'styled-components'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceService } from '../services/resourceService'

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

const PendingBadge = styled.span`
  background: #fff3cd;
  color: #856404;
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ffc107;
`

function ResourceOverview() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { resource, isLoading, error, provisionResource } = useResource(
    resourceId as string,
  )
  const buffer = useResourceEditBuffer()
  const bufferData = resourceId ? buffer.buffers[resourceId] : undefined

  const hasPendingChanges = Boolean(bufferData?.basicInfo || bufferData?.projectDetails)

  const effectiveBasicInfo = bufferData?.basicInfo || resource?.basicInfo
  const effectiveProjectDetails = bufferData?.projectDetails || resource?.projectDetails

  const isBasicInfoComplete = Boolean(
    effectiveBasicInfo?.resourceName &&
    effectiveBasicInfo?.owner &&
    effectiveBasicInfo?.email &&
    effectiveBasicInfo?.description &&
    effectiveBasicInfo?.priority,
  )

  const isProjectDetailsComplete = Boolean(
    effectiveProjectDetails?.projectName &&
    effectiveProjectDetails?.budget &&
    effectiveProjectDetails?.category &&
    effectiveProjectDetails?.options?.length > 0,
  )

  const canProvision =
    resource?.status === 'draft' && isBasicInfoComplete && isProjectDetailsComplete

  const handleProvision = async () => {
    await provisionResource()
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      const serverBasicInfo = resource!.basicInfo!
      const serverProjectDetails = resource!.projectDetails!
      const payload = {
        name: resource!.name,
        basicInfo: bufferData?.basicInfo || serverBasicInfo,
        projectDetails: bufferData?.projectDetails || serverProjectDetails,
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
                {isProjectDetailsComplete ? 'Complete' : 'Incomplete'}
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