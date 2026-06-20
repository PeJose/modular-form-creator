import { useParams, useNavigate } from 'react-router'
import { useResource } from '../hooks/useResource'
import { Button, Card, Input, Select } from '../design-system'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectDetailsSchema, type ProjectDetails } from '../schemas/resource.schema'
import { CategoryEnum, TeamMemberEnum, type TeamMember } from '../enums'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { useMemo } from 'react'

const WarningMessage = styled.div`
  color: orange;
  padding: 10px;
  border: 1px solid orange;
  border-radius: 8px;
  margin-bottom: 20px;
`

function ResourceProjectDetails() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { resource, isLoading, error, updateProjectDetails } = useResource(
    resourceId as string,
  )

  const isBasicInfoComplete = Boolean(
    resource?.basicInfo?.resourceName &&
    resource?.basicInfo?.owner &&
    resource?.basicInfo?.email &&
    resource?.basicInfo?.description &&
    resource?.basicInfo?.priority,
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectDetails>({
    resolver: zodResolver(ProjectDetailsSchema),
    defaultValues: {
      projectName: resource?.projectDetails?.projectName || '',
      budget: resource?.projectDetails?.budget || '',
      category: resource?.projectDetails?.category || 'internal',
      options: resource?.projectDetails?.options || [],
    },
  })

  const selectedOptions = watch('options') || []

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

  const onSubmit = (data: ProjectDetails) => {
    mutation.mutate(data)
  }

  const availableTeamMemberOptions = useMemo(
    () => TeamMemberEnum.filter((m) => !selectedOptions.includes(m)),
    [selectedOptions],
  )

  const mutation = useMutation({
    mutationFn: (data: ProjectDetails) => updateProjectDetails(data),
    onSuccess: () => {
      navigate(`/resources/${resourceId}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!resource) return <div>Resource not found</div>

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
          {isSubmitting ? 'Saving...' : 'Save Project Details'}
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
