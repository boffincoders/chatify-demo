import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/layout/auth";
import DashBoard from "./pages/dashboard";
import PrivatePage from "./pages/privatePage";
import routes from "./routes";
const getDynamicComponent = (path: string) => {
  const LazyComponent = React.lazy(() => import(`${path}`));
  return LazyComponent


}
function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivatePage Children={DashBoard} />}>
            {routes.map(x => {
              if (!x.path.includes("logout")) {
                if (x.children && x.children.length > 0) return x.children.map(child => <Route key={child.key} path={child.key} element={<PrivatePage Children={getDynamicComponent(child.path)} />} />)
                else return <Route key={x.key} path={x.key} element={<PrivatePage Children={getDynamicComponent(x.path)} />} />
              }
            })}
          </Route>
          <Route path="/login" element={<AuthLayout />}></Route>
          <Route path="/sign-up" element={<AuthLayout />}></Route>
          <Route path="/add-profile" element={<AuthLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
