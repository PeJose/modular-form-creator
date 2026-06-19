import { Routes, Route } from 'react-router'
import App from './App'
import {
  ResourcesList,
  ResourceOverview,
  ResourceBasicInfo,
  ResourceProjectDetails,
  ResourceDetails,
} from './views'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="resources">
        <Route index element={<ResourcesList />} />

        <Route path=":resourceId">
          <Route path="overview" element={<ResourceOverview />} />

          <Route path="basic-info" element={<ResourceBasicInfo />} />

          <Route path="project-details" element={<ResourceProjectDetails />} />

          <Route path="details" element={<ResourceDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}
