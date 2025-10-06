import NewAppComponent from "./pages/NewAppComponent"
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import { Toaster } from "sonner";

const AppRouter = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={user ? <Navigate to="/dashboard" replace /> : <Auth />} 
        />
        <Route path='/' element={<Auth />} />
        <Route path='/dashboard' element={<ProtectedRoute><NewAppComponent/></ProtectedRoute>} />
      </Routes> 
    </BrowserRouter>
  )
}

function App() {
   return (
     <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
   )
}

export default App
