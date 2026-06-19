import { useState } from 'react'
import styled from 'styled-components'
import { Drawer, Input, Button } from '../design-system'

interface CreateResourceDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  error?: string | null
}

export function CreateResourceDrawer({
  isOpen,
  onClose,
  onSubmit,
  error,
}: CreateResourceDrawerProps) {
  const [localName, setLocalName] = useState('')

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Create New Resource">
      <FormContainer>
        <div>
          <label
            htmlFor="resource-name"
            style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink-strong)', marginBottom: '0.5rem' }}
          >
            Resource Name
          </label>
          <Input
            id="resource-name"
            placeholder="Enter resource name..."
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            autoFocus
          />
        </div>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        <ActionBar>
          <Button onClick={onClose} variant="secondary" size="small">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(localName)}
            disabled={!localName.trim()}
            variant="primary"
            size="medium"
          >
            Create Resource
          </Button>
        </ActionBar>
      </FormContainer>
    </Drawer>
  )
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: 0.25rem;
  color: var(--red-600);
  font-size: 0.875rem;
`

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
`
