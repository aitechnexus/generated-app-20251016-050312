import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { UserPage } from '@/pages/UserPage';
import { RepoPage } from '@/pages/RepoPage';
import { IssueDetailPage } from '@/pages/IssueDetailPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/user/:username",
    element: <UserPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/repo/:owner/:repo/*",
    element: <RepoPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/repo/:owner/:repo/issues/:issue_number",
    element: <IssueDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)