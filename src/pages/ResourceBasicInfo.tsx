import { useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { Button, Select } from '../design-system'
import { Card } from '../design-system'
import { Input } from '../design-system'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicInfoSchema, type BasicInfo } from '../schemas/resource.schema'
import { PriorityEnum } from '../enums'
import { useMutation } from '@tanstack/react-query'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'
import styled from 'styled-components'

const BufferNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9em;
`

function ResourceBasicInfo() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { resource, isLoading, error, updateBasicInfo } = useResource(
    resourceId as string,
  )
  const buffer = useResourceEditBuffer()

  const defaultBasicInfo =
    (resourceId && buffer.buffers[resourceId]?.basicInfo) ||
    resource?.basicInfo

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: defaultBasicInfo || {},
    values: defaultBasicInfo,
  })

  const mutation = useMutation({
    mutationFn: (data: BasicInfo) => updateBasicInfo(data),
    onSuccess: () => {
      navigate(`/resources/${resourceId}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const isCompleted = resource.status === 'completed'

  const onSubmit = (data: BasicInfo) => {
    const payload = {
      ...data,
      resourceName: resource.basicInfo?.resourceName || resource.name,
    }
    if (isCompleted) {
      const server = resource.basicInfo
      if (
        server &&
        server.owner === payload.owner &&
        server.email === payload.email &&
        server.description === payload.description &&
        server.priority === payload.priority
      ) {
        navigate(`/resources/${resourceId}`)
        return
      }
      buffer.setBasicInfo(resourceId!, payload)
      navigate(`/resources/${resourceId}`)
    } else {
      mutation.mutate(payload)
    }
  }

  return (
    <Card>
      <h1>Basic Info</h1>
      {isCompleted && (
        <BufferNotice>
          Changes are saved locally. Return to overview to submit all pending
          changes.
        </BufferNotice>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('resourceName', { disabled: true })}
          value={resource.basicInfo?.resourceName || resource.name}
          label="Resource Name"
          style={{
            backgroundColor: '#f5f5f5',
            cursor: 'not-allowed',
            opacity: 0.7,
          }}
          error={errors.resourceName?.message}
        />
        <Input {...register('owner')} label="Owner" error={errors.owner?.message} />
        <Input {...register('email')} label="Email" error={errors.email?.message} />
        <Input
          {...register('description')}
          label="Description"
          error={errors.description?.message}
        />
        <Select
          {...register('priority')}
          label="Priority"
          options={[
            { value: '', label: 'Select priority' },
            ...PriorityEnum.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) })),
          ]}
          error={errors.priority?.message}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          variant={isSubmitting ? 'secondary' : 'primary'}
          style={{ marginTop: '20px' }}
        >
          {isSubmitting
            ? 'Saving...'
            : isCompleted
              ? 'Save Locally'
              : 'Save Basic Info'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/resources/${resourceId}`)}
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Back to Overview
        </Button>
      </form>
    </Card>
  )
}

export default ResourceBasicInfo