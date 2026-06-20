import { Outlet } from 'react-router'
import styled from 'styled-components'

const LayoutContainer = styled.div`
  padding: 20px;
  max-width: 800px;
`

export const ResourceLayout = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  )
}
