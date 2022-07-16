import { Button, Container, FormControl, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { edit_user } from "../Redux/request"

export default function Profile(props) {
    const user = useSelector(store => store.user.data)
    const dispatch = useDispatch()
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    useEffect(() => {
        setProfileData({
            ...user
        });
    }, [user])
    return (
        <Container>
            <Grid container>
                <Paper sx={{ margin: "10vh auto", padding: "5vh 0", width: "60%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <FormControl sx={{ width: "80%" ,mt:2}}>
                        <TextField value={profileData.name} label="name" onChange={(e) => { setProfileData({ ...profileData, name: e.target.value }) }} />
                    </FormControl>
                    <FormControl sx={{ width: "80%",mt:2 }}>
                        <TextField value={profileData.username} label="username" onChange={(e) => { setProfileData({ ...profileData, username: e.target.value }) }} />
                    </FormControl>
                    <FormControl sx={{ width: "80%",mt:2 }}>
                        <TextField value={profileData.email} label="email" onChange={(e) => { setProfileData({ ...profileData, email: e.target.value }) }} />
                    </FormControl>
                    <FormControl sx={{ width: "80%",mt:2 }}>
                        <TextField value={profileData.password} label="password" onChange={(e) => { setProfileData({ ...profileData, password: e.target.value }) }} />
                    </FormControl>
                    <FormControl sx={{ width: "80%",mt:2 }}>
                        <Button onClick={()=>{dispatch(edit_user(profileData))}}>save</Button>
                    </FormControl>
                </Paper>
            </Grid>
        </Container>
    )
}
