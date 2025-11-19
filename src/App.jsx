import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard'
import BoardDetail from './components/BoardDetail'
import Login from "./components/Login";
import Signup from "./components/Signup";
import RequireAuth from "./middleware/RequireAuth";
import PreventAuth from "./middleware/PreventAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PreventAuth><Login /></PreventAuth>} />
        <Route path="/signup" element={<PreventAuth><Signup /></PreventAuth>} />

        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/board/:id" element={<RequireAuth><BoardDetail /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter >
  )
}