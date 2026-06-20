import { useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { Button, Card, Input, Select } from '../design-system'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectDetailsSchema, type ProjectDetails } from '../schemas/resource.schema'
import { CategoryEnum, TeamMemberEnum, type TeamMember } from '../enums'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { useResourceEditBuffer } from '../store/resourceEditBuffer'

const WarningMessage = styled.div`
  color: orange;
  padding: 10px;
  border: 1px solid orange;
  border-radius: 8px;
  margin-bottom: 20px;
`

const BufferNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9em;
`

function ResourceProjectDetails() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { resource, isLoading, error, updateProjectDetails } = useResource(
    resourceId as string,
  )
  const buffer = useResourceEditBuffer()

  const isBasicInfoComplete = Boolean(
    resource?.basicInfo?.resourceName &&
    resource?.basicInfo?.owner &&
    resource?.basicInfo?.email &&
    resource?.basicInfo?.description &&
    resource?.basicInfo?.priority,
  )

  const defaultProjectDetails =
    (resourceId && buffer.buffers[resourceId]?.projectDetails) ||
    resource?.projectDetails

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectDetails>({
    resolver: zodResolver(ProjectDetailsSchema),
    defaultValues: {
      projectName: defaultProjectDetails?.projectName || '',
      budget: defaultProjectDetails?.budget || '',
      category: defaultProjectDetails?.category || 'internal',
      options: defaultProjectDetails?.options || [],
    },
    values: {
      projectName: defaultProjectDetails?.projectName || '',
      budget: defaultProjectDetails?.budget || '',
      category: defaultProjectDetails?.category || 'internal',
      options: defaultProjectDetails?.options || [],
    },
  })

  const selectedOptions = (useWatch({ control, name: 'options' }) || []) as TeamMember[]

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TeamMember
    if (value && !selectedOptions.includes(value)) {
      setValue('options', [...selectedOptions, value])
    }
  }

  const handleRemove = (opt: ProjectDetails['options'][number]) => {
    setValue(
      'options',
      selectedOptions.filter((o) => o !== opt),
    )
  }

  const availableTeamMemberOptions = TeamMemberEnum.filter(
    (m) => !selectedOptions.includes(m),
  )

  const mutation = useMutation({
    mutationFn: (data: ProjectDetails) => updateProjectDetails(data),
    onSuccess: () => {
      navigate(`/resources/${resourceId}`)
    },
  })

  const onSubmit = (data: ProjectDetails) => {
    if (resource?.status === 'completed') {
      const server = resource.projectDetails
      if (
        server &&
        server.projectName === data.projectName &&
        server.budget === data.budget &&
        server.category === data.category &&
        JSON.stringify(server.options) === JSON.stringify(data.options)
      ) {
        navigate(`/resources/${resourceId}`)
        return
      }
      buffer.setProjectDetails(resourceId!, data)
      navigate(`/resources/${resourceId}`)
    } else {
      mutation.mutate(data)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

  const isCompleted = resource.status === 'completed'

  if (resource.status === 'draft' && !isBasicInfoComplete) {
    return (
      <Card>
        <h1>Project Details</h1>
        <WarningMessage>Please complete Basic Info first.</WarningMessage>
      </Card>
    )
  }

  return (
    <Card>
      <h1>Project Details</h1>
      {isCompleted && (
        <BufferNotice>
          Changes are saved locally. Return to overview to submit all pending
          changes.
        </BufferNotice>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('projectName')}
          label="Project Name"
          error={errors.projectName?.message}
        />
        <Input {...register('budget')} label="Budget" error={errors.budget?.message} />
        <Select
          options={[
            { value: '', label: 'Select category' },
            ...CategoryEnum.map((cat) => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
          ]}
          {...register('category')}
          defaultValue=""
          label="Category"
          error={errors.category?.message}
        />

        <div>
          <Select
            options={[
              { value: '', label: 'Select option' },
              ...availableTeamMemberOptions.map((member) => ({
                value: member,
                label: member,
              })),
            ]}
            disabled={availableTeamMemberOptions.length < 1}
            onChange={handleSelectChange}
            label="Select team members"
          />
          <div style={{ marginTop: 10 }}>
            {selectedOptions.map((opt) => (
              <div
                key={opt}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <span>{opt}</span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleRemove(opt)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>
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
              : 'Save Project Details'}
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

export default ResourceProjectDetails