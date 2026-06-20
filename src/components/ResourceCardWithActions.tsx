import { Link } from 'react-router'
import styled from 'styled-components'
import { Button, Card } from '../design-system'
import { ResourceStatusBadge } from './ResourceStatusBadge'
import type { Resource } from '../types/resource'

interface ResourceCardWithActionsProps {
  resource: Resource
  onDelete?: (id: string) => Promise<void>
}

const StyledCard = styled(Card)`
  min-height: 140px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 0.5rem;
`

const ResourceName = styled(Link)`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink-strong);
  transition: color 0.2s;
  &:hover {
    color: var(--primary);
  }
`

const Description = styled.p<{ $empty?: boolean }>`
  font-size: 0.875rem;
  color: var(--ink-medium);
  margin-top: 0.5rem;
  visibility: ${({ $empty }) => ($empty ? 'hidden' : 'visible')};
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-border);
  margin-top: auto;
`

const DetailsLink = styled(Link)`
  font-size: 0.875rem;
  color: var(--primary);
  text-decoration: underline;
  &:hover {
    text-decoration: none;
  }
`

export function ResourceCardWithActions({
  resource,
  onDelete,
}: ResourceCardWithActionsProps) {
  const navigateUrl = `/resources/${resource._id}`
  const hasDescription = Boolean(resource.basicInfo?.description || resource.projectDetails?.projectName)
  const descriptionText = resource.basicInfo?.description || resource.projectDetails?.projectName || ''

  return (
    <StyledCard variant="outline">
      <Header>
        <ResourceName to={navigateUrl}>{resource.name}</ResourceName>
        <ResourceStatusBadge
          variant={resource.status === 'completed' ? 'success' : 'warning'}
        >
          {resource.status || 'draft'}
        </ResourceStatusBadge>
      </Header>

      <Description $empty={!hasDescription}>
        {descriptionText || '\u00A0'}
      </Description>

      <Footer>
        <DetailsLink to={navigateUrl}>View Details →</DetailsLink>
        {onDelete && (
          <Button
            onClick={() => onDelete(resource._id as string)}
            variant="secondary"
            size="small"
          >
            Delete
          </Button>
        )}
      </Footer>
    </StyledCard>
  )
}
