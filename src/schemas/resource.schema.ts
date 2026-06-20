import { z } from 'zod'
import { CategoryEnum, PriorityEnum, TeamMemberEnum } from '../enums'

export const BasicInfoSchema = z.object({
  resourceName: z.string().min(1, 'Resource name is required'),
  owner: z.string().min(1, 'Owner is required'),
  email: z.email('Invalid email'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(PriorityEnum, 'Priority must be one of: low, medium, high'),
})

export const ProjectDetailsSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  budget: z.string().min(1, 'Budget is required'),
  category: z.enum(CategoryEnum, 'Category must be one of: internal, external, vendor'),
  options: z.array(z.enum(TeamMemberEnum)).min(1, 'At least one option is required'),
})

export type BasicInfo = z.infer<typeof BasicInfoSchema>
export type ProjectDetails = z.infer<typeof ProjectDetailsSchema>
