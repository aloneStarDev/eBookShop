import { Button, FormControl, Icon, Input, Paper, Typography } from "@mui/material";
import { login } from "../Redux/RequestSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { useState } from "react";
export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState({ username: "", password: "" });
    return (
        <Paper elevation={24} sx={{ margin: "10vh auto", width: "fit-content" }} spacing={12}>
            <Typography variant="h2" sx={{ textAlign: "center", padding: " 40px 0 0 0" }}>
                Login
            </Typography>
            <Box sx={{ width: "25vw", margin: "0 auto", padding: "0 30px" }}>
                <FormControl
                    sx={{ width: "100%" }}
                >
                    <Input
                        placeholder="username"
                        onChange={e=>setData({...data,username:e.target.value})}
                        sx={{ marginTop: "50px" }}
                        startAdornment={<Icon sx={{ padding: "20px" }}>person</Icon>}
                    />
                </FormControl>
                <FormControl
                    sx={{ width: "100%" }}
                >
                    <Input
                        type="password"
                        onChange={e=>setData({...data,password:e.target.value})}
                        placeholder="password"
                        sx={{ marginTop: "20px" }}
                        startAdornment={<Icon sx={{ padding: "20px" }}>key</Icon>}
                    />
                </FormControl>
                <FormControl
                    sx={{ width: "100%" }}
                >
                    <Button
                        variant="contained"
                        sx={{ margin: "50px auto 0 auto", width: "50%" }}
                        onClick={e => dispatch(login(data))}
                    >
                        Login
                    </Button>
                </FormControl>
                <FormControl
                    sx={{ width: "100%" }}
                >   <Button
                    sx={{ margin: "20px auto", width: "50%" }}
                    onClick={e => navigate("/register")}
                >
                        or create account ?
                    </Button>
                </FormControl>
            </Box>
        </Paper >
    )
}