import { useAuth } from "../Context/AuthContext.jsx";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(auth?.user === null && !auth?.isLoading){
            navigate('/', { replace: true });
        }
    }, [navigate, auth]);

    return <>{children}</>;
}

export default ProtectedRoute;