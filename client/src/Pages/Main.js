import { useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

export default function Main() {
    const jwt = useSelector(state => state.request.jwt);
    const navigate = useNavigate();
    useEffect(() => {
        if (jwt === null)
            navigate("/login");
    }, [jwt]);
    return (
        <h1>main</h1>
    )
}