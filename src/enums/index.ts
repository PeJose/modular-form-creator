
export const CategoryEnum = ['internal', 'external', 'vendor'] as const
export type Category = (typeof CategoryEnum)[number]

export const PriorityEnum = ['low', 'medium', 'high'] as const
export type Priority = (typeof PriorityEnum)[number]

export const TeamMemberEnum = ['FE devs', 'BE devs', 'Designer', 'Data Eng', 'Product Owner'] as const
export type TeamMember = (typeof TeamMemberEnum)[number]
