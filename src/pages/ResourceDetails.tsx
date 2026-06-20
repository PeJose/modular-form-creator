import { useParams, useNavigate } from 'react-router'
import { Button, Card, Badge } from '../design-system'
import styled from 'styled-components'
import { useResource } from '../hooks/useResource'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModuleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`

const FieldLabel = styled.span`
  font-weight: 600;
  color: var(--ink-medium);
`

const FieldValue = styled.span`
  color: var(--ink-strong);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const PendingBadge = styled.span`
  background: #fff3cd;
  color: #856404;
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ffc107;
  margin-left: 8px;
`

function ResourceDetails() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { resource, isLoading, error } = useResource(resourceId as string)
  const buffer = useResourceEditBuffer()
  const bufferData = resourceId ? buffer.buffers[resourceId] : undefined

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const effectiveBasicInfo = bufferData?.basicInfo || resource.basicInfo
  const effectiveProjectDetails = bufferData?.projectDetails || resource.projectDetails

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

  return (
    <PageContainer>
      <HeaderSection>
        <h1>{resource.name} — Details</h1>
        <Button variant="secondary" onClick={() => navigate(`/resources/${resourceId}`)}>
          Back to Overview
        </Button>
      </HeaderSection>

      <Card>
        <SectionHeader>
          <h3>Basic Info</h3>
          <div>
            {bufferData?.basicInfo && <PendingBadge>Pending</PendingBadge>}
            <Badge variant={isBasicInfoComplete ? 'success' : 'warning'}>
              {isBasicInfoComplete ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
        </SectionHeader>
        {effectiveBasicInfo ? (
          <ModuleCard>
            <FieldRow>
              <FieldLabel>Resource Name</FieldLabel>
              <FieldValue>{effectiveBasicInfo.resourceName}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Owner</FieldLabel>
              <FieldValue>{effectiveBasicInfo.owner}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Email</FieldLabel>
              <FieldValue>{effectiveBasicInfo.email}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Description</FieldLabel>
              <FieldValue>{effectiveBasicInfo.description}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Priority</FieldLabel>
              <FieldValue>{effectiveBasicInfo.priority}</FieldValue>
            </FieldRow>
          </ModuleCard>
        ) : (
          <p style={{ color: 'var(--ink-medium)' }}>No data yet.</p>
        )}
      </Card>

      <Card>
        <SectionHeader>
          <h3>Project Details</h3>
          <div>
            {bufferData?.projectDetails && <PendingBadge>Pending</PendingBadge>}
            <Badge variant={isProjectDetailsComplete ? 'success' : 'warning'}>
              {isProjectDetailsComplete ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
        </SectionHeader>
        {effectiveProjectDetails ? (
          <ModuleCard>
            <FieldRow>
              <FieldLabel>Project Name</FieldLabel>
              <FieldValue>{effectiveProjectDetails.projectName}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Budget</FieldLabel>
              <FieldValue>{effectiveProjectDetails.budget}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Category</FieldLabel>
              <FieldValue>{effectiveProjectDetails.category}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Team Members</FieldLabel>
              <FieldValue>{effectiveProjectDetails.options.join(', ')}</FieldValue>
            </FieldRow>
          </ModuleCard>
        ) : (
          <p style={{ color: 'var(--ink-medium)' }}>No data yet.</p>
        )}
      </Card>
    </PageContainer>
  )
}

export default ResourceDetails
