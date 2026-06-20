import { useState } from 'react'
import styled from 'styled-components'
import { useResources } from '../hooks/useResources'
import { CreateResourceDrawer } from '../components/CreateResourceDrawer'
import { ResourceCardWithActions } from '../components/ResourceCardWithActions'
import { Button } from '../design-system'
import axios from 'axios'

function ResourcesList() {
  const [page, setPage] = useState(1)
  const { resources, pagination, isLoading, error, createResource, deleteResource } = useResources(page)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const handleCreateSubmit = async (name: string) => {
    setCreateError(null)
    try {
      await createResource(name.trim())
      setPage(1)
      setIsCreateOpen(false)
    } catch (err: unknown) {
      let errorMessage = 'Failed to create resource'
      if (err instanceof axios.AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setCreateError(errorMessage)
    }
  }

  const handleDelete = async (id: string) => {
    if (id && window.confirm('Are you sure you want to delete this resource?')) {
      await deleteResource(id)
    }
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <div className="text-ink-medium">Loading resources...</div>
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <div className="font-semibold text-red-800">Error loading resources</div>
        <div className="text-sm text-red-600 mt-1">{error.message}</div>
      </ErrorContainer>
    )
  }

  return (
    <MainContainer>
      <HeaderContainer>
        <h1 className="text-2xl font-semibold text-ink-strong">Resources</h1>
        <Button onClick={() => setIsCreateOpen(true)} variant="primary" size="medium">
          Create New Resource
        </Button>
      </HeaderContainer>

      {resources && resources.length > 0 ? (
        <>
          <GridContainer>
            {resources.map((resource) => (
              <ResourceCardWithActions
                key={resource._id}
                resource={resource}
                onDelete={handleDelete}
              />
            ))}
          </GridContainer>
          {pagination && (
            <PaginationContainer>
              <Button
                variant="secondary"
                size="small"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </Button>
              <PageInfo>
                Page {pagination.page} of {pagination.totalPages}
              </PageInfo>
              <Button
                variant="secondary"
                size="small"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </PaginationContainer>
          )}
        </>
      ) : resources && resources.length === 0 ? (
        <EmptyContainer>
          <div className="text-3xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">No resources yet</h2>
          <p className="max-w-md text-center max-w-lg">
            Create your first resource to get started. Click the button above or use this
            quick form.
          </p>
        </EmptyContainer>
      ) : (
        <NotFoundContainer>
          <div className="text-ink-medium">No resources found</div>
        </NotFoundContainer>
      )}

      {createError && <CreateErrorContainer>{createError}</CreateErrorContainer>}

      <CreateResourceDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        error={createError}
      />
    </MainContainer>
  )
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
`

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: var(--ink-medium);
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: 0.5rem;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--ink-medium);
  text-align: center;
`

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--ink-medium);
`

const CreateErrorContainer = styled.div`
  padding: 1rem;
  background-color: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: 0.5rem;
  color: var(--red-600);
  font-size: 0.875rem;
`

export default ResourcesList
