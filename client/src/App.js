import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AgentProfile from "./pages/AgentProfile/AgentProfile";
import Explore from "./pages/Explore/Explore";
import Signin from "./pages/Signin/Signin";
// import Navbar from "./components/Navbar/Navbar";
import Error from "./pages/Error/Error";
import Navbar from "./components/Navbar/Navbar";
import AgentAdd from "./pages/AgentForm/AgentAdd";
import { useLocation } from "react-router-dom";
const Layout = () => {
  const location = useLocation().pathname.split("/");
  console.log(location.length, location)
  return (
    <>
      {location && (location[1] === "" || location[1] === "signout") ? <></> : <Navbar />}
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
        element: <Signin />,
      },
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/agentadd",
        element: <AgentAdd />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/agentprofile/:agentId",
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
