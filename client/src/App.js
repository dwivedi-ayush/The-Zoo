import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AgentProfile from "./pages/AgentProfile/AgentProfile";
import Explore from "./pages/Explore/Explore";
import Signin from "./pages/Signin/Signin";
// import Navbar from "./components/Navbar/Navbar";
import Error from "./pages/Error/Error";
import TestPage from "./pages/TestPage";
import Navbar from "./components/Navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="w-full px-12 py-4">
        <Outlet></Outlet>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/agentprofile",
        element: <AgentProfile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },

      {
        path: "/signout",
        element: <Signin />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
    ],
  },
]);

function App() {
  return (
    // <TestPage></TestPage>
    <div className="w-full">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
