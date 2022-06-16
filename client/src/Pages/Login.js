import { Box, Button, Container, FormControl, Grid, Icon, Input, Paper, Typography } from "@mui/material";
import { login } from "../Redux/RequestSlice";
import { useDispatch } from "react-redux";
export default function Login() {
    const dispatch = useDispatch();
    return (
        <Paper elevation={24} sx={{ margin: "10vh auto", width: "fit-content" }} spacing={12}>
            <FormControl sx={{ width: "25vw", padding: "60px 30px" }}>
                <Typography variant="h2" sx={{ textAlign: "center" }}>
                    Login
                </Typography>
                <Input
                    placeholder="username"
                    sx={{ marginTop: "10%" }}
                    startAdornment={<Icon sx={{ padding: "20px" }}>person</Icon>}
                />
                <Input
                    placeholder="password"
                    sx={{ marginTop: "10%", textAlign: "center" }}
                    startAdornment={<Icon sx={{ padding: "20px" }}>key</Icon>}
                />
                <Button
                    sx={{ marginTop: "10%" }}
                    onClick={e=>dispatch(login({username:"admin",password:"test"}))}
                >
                    Login
                </Button>
            </FormControl>
        </Paper>
    )
}