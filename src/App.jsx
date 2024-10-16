import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import './assets/styles/index.css'
import { AuthProvider } from "./context/AuthContext";
import { Login, Add, List, EnrollmentList, NotFound } from "./pages";
import AdminLayout from "./layout/AdminLayout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "/", element: <Navigate to="/admin/list" /> },
      { path: "/admin/add", element: <Add /> },
      { path: "/admin/list", element: <List /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/enrollmentlist", element: <EnrollmentList /> },
  { path: '*', element: <NotFound /> }
]);



export default function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

