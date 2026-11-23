import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Works } from './pages/Works'
import { ProjectDetail } from './pages/ProjectDetail'
import { About } from './pages/About'
import { Credits } from './pages/Credits'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

// Same page tree for both languages; Persian is mounted under /fa
const pages = () => [
  { index: true, Component: Home },
  { path: 'works', Component: Works },
  { path: 'works/:slug', Component: ProjectDetail },
  { path: 'about', Component: About },
  { path: 'credits', Component: Credits },
  { path: 'contact', Component: Contact },
  { path: '*', Component: NotFound },
]

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [{ path: 'fa', children: pages() }, ...pages()],
  },
])
