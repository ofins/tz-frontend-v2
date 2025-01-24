import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { authProvider } from "./authProvider";
import { Layout } from "./components/layout";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import TokenList from "./pages/token/list";
import TokenShow from "./pages/token/show";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
          routerProvider={routerBindings}
          authProvider={authProvider}
          resources={[
            {
              name: "tokens",
              list: "/tokens",
              show: "/tokens/show/:id",
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "wj67ld-3GCfsU-W4TYAb",
          }}
        >
          {/* <Routes>
            <Route index element={<WelcomePage />} />
          </Routes> */}
                        <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      {/* <ThemedLayoutV2
                        Header={Header}
                        Sider={() => (
                          <ThemedSiderV2
                            Title={() => (
                              <span style={{ fontWeight: 700, fontSize: 18 }}>
                                Tama Zoo
                              </span>
                            )}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2> */}
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="tokens" />}
                  />
                  <Route path="/tokens">
                    <Route index element={<TokenList />} />
                    {/* <Route path="create" element={<BlogPostCreate />} /> */}
                    {/* <Route path="edit/:id" element={<BlogPostEdit />} /> */}
                    <Route path="show/:id" element={<TokenShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
              </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
