import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostsDetail from "./pages/PostsDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Authors from "./pages/Authors";
import UserProfile from "./pages/UserProfile";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import CategoryPosts from "./pages/CategoryPosts";
import AuthorPosts from "./pages/AuthorPosts";
import Logout from "./pages/Logout";
import UserProvider from './context/userContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout /></UserProvider>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, element: <Home/>},
      {path: "posts/:id", element: <PostsDetail/>},
      {path: "register", element: <Register/>},
      {path: "login", element: <Login/>},
      {path: "authors", element: <Authors/>},
      {path: "profile/:id", element: <UserProfile/>},
      {path: "create", element: <CreatePost/>},
      {path: "myposts/:id", element: <Dashboard/>},
      {path: "posts/:id/edit", element: <EditPost/> },
      {path: "posts/:id/delete", element: <DeletePost/>},
      {path: "posts/categories/:category", element: <CategoryPosts/>},
      {path: "posts/users/:id", element: <AuthorPosts/>},
      {path: "logout", element: <Logout/>}
      
    ]
  }
])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);


