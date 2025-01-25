import { ErrorComponent, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import routerBindings, { DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from '@refinedev/react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import { authProvider } from './authProvider'
import Layout from './components/layout'
import { ThemeProvider } from './components/theme-provider'
import TokenList from './pages/token/list'
import TokenShow from './pages/token/show'
import { dataProvider } from './providers/dataProvider'
import { $axios } from './services/axios'

function App() {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <BrowserRouter>
        <Analytics />
        <SpeedInsights />
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider(import.meta.env.VITE_TAMA_BACKEND_URL, $axios)}
            routerProvider={routerBindings}
            authProvider={authProvider}
            resources={[
              {
                name: 'tokens',
                list: '/tokens',
                show: '/tokens/show/:id',
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: 'wj67ld-3GCfsU-W4TYAb',
            }}
          >
            <Routes>
              <Route
                element={
                  // <Authenticated
                  //   key="authenticated-inner"
                  //   fallback={<CatchAllNavigate to="/login" />}
                  // >
                  <Layout>
                    <Outlet />
                  </Layout>
                  // </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="tokens" />}
                />
                <Route path="/tokens">
                  <Route
                    index
                    element={<TokenList />}
                  />
                  <Route
                    path="show/:id"
                    element={<TokenShow />}
                  />
                </Route>
                <Route
                  path="*"
                  element={<ErrorComponent />}
                />
              </Route>
              {/* <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/register"
                  element={<Register />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                />
              </Route> */}
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineKbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
