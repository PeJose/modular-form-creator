import { Link } from 'react-router'
import styled from 'styled-components'
import { Button } from '../design-system'
import { ResourceStatusBadge } from './ResourceStatusBadge'
import type { Resource } from '../types/resource'
 
interface ResourceCardWithActionsProps {
  resource: Resource
  onDelete?: (id: string) => Promise<void>
}
 
const CardContainer = styled.div`
  background-color: var(--surface-card, #ffffff);
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
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
 
const Description = styled.p`
  font-size: 0.875rem;
  color: var(--ink-medium);
  margin-top: 0.5rem;
`
 
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-border);
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
  const navigateUrl = `/resources/${resource.id}/overview`
  
  return (
    <CardContainer>
      <Header>
        <ResourceName to={navigateUrl}>
          {resource.name}
        </ResourceName>
        <ResourceStatusBadge
          variant={resource.status === 'completed' ? 'success' : 'warning'}
        >
          {resource.status || 'draft'}
        </ResourceStatusBadge>
      </Header>
      
      {(resource.basicInfo?.description || resource.projectDetails?.projectName) && (
        <Description>
          {resource.basicInfo?.description || resource.projectDetails?.projectName}
        </Description>
      )}
      
      <Footer>
        <DetailsLink to={navigateUrl}>
          View Details →
        </DetailsLink>
        {onDelete && (
          <Button
            onClick={() => onDelete(resource.id as string)}
            variant="secondary"
            size="small"
          >
            Delete
          </Button>
        )}
      </Footer>
    </CardContainer>
  )
}

