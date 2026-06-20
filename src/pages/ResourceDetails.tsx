import { useParams, useNavigate } from 'react-router'
import { Button, Card, Badge } from '../design-system'
import styled from 'styled-components'
import { useResource } from '../hooks/useResource'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'
import { PendingBadge } from '../components/PendingBadge'
import { ResourceStatusBadge } from '../components/ResourceStatusBadge'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../utils/moduleHelpers'
import { BackToOverviewButton } from '../components/BackToOverviewButton'

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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const NoData = styled.p`
  color: var(--ink-medium);
`

function ResourceDetails() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { resource, isLoading, error } = useResource(resourceId as string)
  const buffer = useResourceEditBuffer()
  const bufferData = buffer.getBuffer(resourceId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const effectiveBasicInfo = bufferData?.basicInfo || resource.basicInfo
  const effectiveProjectDetails = bufferData?.projectDetails || resource.projectDetails

  const basicInfoComplete = isBasicInfoComplete(effectiveBasicInfo)
  const projectDetailsComplete = isProjectDetailsComplete(effectiveProjectDetails)

  return (
    <PageContainer>
      <HeaderSection>
        <TitleRow>
          <Button variant="secondary" size="small" onClick={() => navigate('/resources')}>
            ← Back to Resources
          </Button>
          <h1>{resource.name} — Details</h1>
          <ResourceStatusBadge status={resource.status} />
        </TitleRow>
        <BackToOverviewButton resourceId={resourceId!} label="Edit Resource" />
      </HeaderSection>

      <Card>
        <SectionHeader>
          <h3>Basic Info</h3>
          <div>
            {bufferData?.basicInfo && <PendingBadge>Pending</PendingBadge>}
            <Badge variant={basicInfoComplete ? 'success' : 'warning'}>
              {basicInfoComplete ? 'Complete' : 'Incomplete'}
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
          <NoData>No data yet.</NoData>
        )}
      </Card>

      <Card>
        <SectionHeader>
          <h3>Project Details</h3>
          <div>
            {bufferData?.projectDetails && <PendingBadge>Pending</PendingBadge>}
            <Badge variant={projectDetailsComplete ? 'success' : 'warning'}>
              {projectDetailsComplete ? 'Complete' : 'Incomplete'}
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
          <NoData>No data yet.</NoData>
        )}
      </Card>
    </PageContainer>
  )
}

export default ResourceDetails