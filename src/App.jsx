import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard'
import BoardDetail from './components/BoardDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board/:id" element={<BoardDetail />} />
      </Routes>
    </BrowserRouter>
  )
}