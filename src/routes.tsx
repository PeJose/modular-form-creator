import { Routes, Route } from 'react-router'
import App from './App'
import {
  ResourcesList,
  ResourceOverview,
  ResourceBasicInfo,
  ResourceProjectDetails,
  ResourceDetails,
} from './pages'
import { Layout } from './components/layout/Layout'
import { ResourceLayout } from './components/layout/ResourceLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="resources" element={<Layout />}>
        <Route index element={<ResourcesList />} />

        <Route path=":resourceId" element={<ResourceLayout />}>
          <Route index element={<ResourceOverview />} />

          <Route path="basic-info" element={<ResourceBasicInfo />} />

          <Route path="project-details" element={<ResourceProjectDetails />} />

          <Route path="details" element={<ResourceDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}
