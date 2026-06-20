import { Outlet } from 'react-router'
import styled from 'styled-components'

const LayoutContainer = styled.div`
  padding: 20px;
`

export const ResourceLayout = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  )
}
