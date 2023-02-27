import React, { Component } from 'react';
import './styles/App.css';
import { Root } from './Root';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { HomePage } from './pages/Home';
import {tasksLoader, createTask, SpendIncomePage} from './pages/SpendIncomePage';
import { statsLoader, StatsPage } from './pages/StatsPage';
import { categoriesLoader, createCategory, CategoryPage } from './pages/CategoryPage';
import { logoutAction } from './components/Logout';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    action: logoutAction,
    children: [
      {index: true, element: <HomePage />},
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'tasks/:type',
        loader: categoriesLoader,
        action: createCategory,
        element: <CategoryPage />
      },
      {
        path: 'tasks/:type/:category_id',
        loader: tasksLoader,
        action: createTask,
        element: <SpendIncomePage />
      },
      {
        path: 'stats',
        loader: statsLoader,
        element: <StatsPage />
      }
    ]
  }
])

class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <RouterProvider router={router}/> 
      </React.StrictMode>
    )
  }
}

export default App;
