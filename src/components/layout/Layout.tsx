import { Outlet } from 'react-router'
import styled from 'styled-components'

const LayoutContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--surface-background, #ffffff);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const Layout = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  )
}
