import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import tools from '@/lib/tools'
import ThemeProvider from '@/theme/ThemeProvider'
import Home from '@/pages/Home'
import ToolLayout from '@/pages/Tools/ToolLayout'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolLayout />}>
            {tools.map(({ id, Component }) => (
              <Route key={id} path={id} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
