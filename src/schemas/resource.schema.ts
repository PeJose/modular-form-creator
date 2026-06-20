import { z } from 'zod'
import { CategoryEnum, PriorityEnum, TeamMemberEnum } from '../enums'

const nameRegex = /^[A-Za-z0-9 -]+$/
const ownerRegex = /^[A-Za-z ]+$/
const integerRegex = /^\d+$/

export const BasicInfoSchema = z.object({
  resourceName: z
    .string()
    .min(1, 'Resource name is required')
    .max(255, 'Resource name must be at most 255 characters')
    .regex(nameRegex, 'Resource name can only contain letters, numbers, spaces, and hyphens'),
  owner: z
    .string()
    .min(1, 'Owner is required')
    .max(255, 'Owner must be at most 255 characters')
    .regex(ownerRegex, 'Owner can only contain letters and spaces'),
  email: z.email('Email must be a valid email format'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  priority: z.enum(PriorityEnum, 'Priority must be one of: low, medium, high'),
})

export const ProjectDetailsSchema = z.object({
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(255, 'Project name must be at most 255 characters')
    .regex(nameRegex, 'Project name can only contain letters, numbers, spaces, and hyphens'),
  budget: z
    .string()
    .min(1, 'Budget is required')
    .regex(integerRegex, 'Budget must contain only integers'),
  category: z.enum(CategoryEnum, 'Category must be one of: internal, external, vendor'),
  options: z.array(z.enum(TeamMemberEnum)).min(1, 'At least one option is required'),
})

export type BasicInfo = z.infer<typeof BasicInfoSchema>
export type ProjectDetails = z.infer<typeof ProjectDetailsSchema>
