import { Button, FormControl, Icon, Input, Paper, Typography, TextField } from "@mui/material";
import { register, verify as verifyAction } from "../Redux/RequestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const serverResponse = useSelector(state => state.request.response);
    const [verify, setVerify] = useState({ state: false, code: null });
    const [data, setData] = useState({ name: '', username: '', password: '', email: '' });
    useEffect(() => {
        console.log(serverResponse);
        if (!verify.state && serverResponse.ok) {
            setVerify({ state: true, code: null });
        }
    }, [serverResponse]);
    useEffect(() => {
        setVerify({ state: false, code: null });
        setData({ name: '', username: '', password: '', email: '' });
    }, [])
    return (
        <Paper elevation={24} sx={{ margin: "10vh auto", width: "fit-content" }}>
            <Typography variant="h2" sx={{ textAlign: "center", padding: "40px 0 0 0" }}>
                Register
            </Typography>
            <Box sx={{ width: "25vw", margin: "0 auto", padding: "20px 30px 0 30px" }}>
                {!verify.state ? <>
                    <FormControl
                        sx={{ width: "100%" }}
                    >
                        <Input
                            placeholder="name"
                            sx={{ marginTop: "20px" }}
                            onChange={e => setData({ ...data, name: e.target.value })}
                            startAdornment={<Icon sx={{ padding: "10px" }}>badge</Icon>}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ width: "100%" }}
                    >
                        <Input
                            placeholder="username"
                            sx={{ marginTop: "10px" }}
                            onChange={e => setData({ ...data, username: e.target.value })}
                            startAdornment={<Icon sx={{ padding: "10px" }}>person</Icon>}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ width: "100%" }}
                    >
                        <Input
                            placeholder="email"
                            sx={{ marginTop: "10px" }}
                            onChange={e => setData({ ...data, email: e.target.value })}
                            startAdornment={<Icon sx={{ padding: "10px" }}>mail</Icon>}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ width: "100%" }}
                    >

                        <Input
                            type="password"
                            placeholder="password"
                            sx={{ marginTop: "10px" }}
                            onChange={e => setData({ ...data, password: e.target.value })}
                            startAdornment={<Icon sx={{ padding: "10px" }}>key</Icon>}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ width: "100%" }}
                    >

                        <Button
                            variant="contained"
                            sx={{ margin: "30px auto 0 auto", width: "50%" }}
                            onClick={e => dispatch(register(data))}
                        >
                            Register
                        </Button>
                    </FormControl>
                    <FormControl
                        sx={{ width: "100%" }}
                    >
                        <Button
                            sx={{ margin: "20px auto", width: "50%" }}
                            onClick={e => navigate("/login")}
                        >
                            have account?
                        </Button>
                    </FormControl>
                </> :
                    <>
                        <FormControl
                            sx={{ width: "100%" }}
                        >
                            <TextField
                                label="activation code"
                                sx={{ marginTop: "10px" }}
                                onChange={e => setVerify({ ...verify, code: e.target.value })}
                                startAdornment={<Icon sx={{ padding: "10px" }}>fingerprint</Icon>}
                            />
                        </FormControl>
                        <FormControl
                            sx={{ width: "100%" }}
                        >
                            <Button
                                variant="contained"
                                sx={{ margin: "30px auto", width: "50%" }}
                                onClick={e => dispatch(verifyAction({ username: data.username, code: verify.code }))}
                            >
                                Verify
                            </Button>
                        </FormControl>
                    </>
                }

            </Box>
        </Paper >
    )
}