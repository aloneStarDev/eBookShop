import { AppBar, Autocomplete, Avatar, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Chip, FormControl, FormControlLabel, Grid, Icon, IconButton, Input, Link, Menu, MenuItem, Modal, Paper, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { create_folder, get_fobject_list, remove_fobject } from "../Redux/RequestSlice";
import { toggleMenuItem, toggleSelectItem } from "../Redux/StorageSlice";
import ChipsArray from "../Components/InputWithChip";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'text.default',
    border: '1px solid white',
    borderRadius: "15px",
    p: 4,
};

export default function Main() {
    const jwt = useSelector(state => state.request.jwt);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch()
    const fobjects = useSelector(state => state.storage.current);
    const current_path = useSelector(state => state.storage.path);
    const [anchorEl, setAnchorEl] = useState(null);
    const [modal, toggleModal] = useState(false);
    const [chipData, setChipData] = useState([]);
    const [newFolder, setNewFolder] = useState({ vpath: current_path, name: "", access: [], public: false });
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt === null)
            navigate("/login");
        else
            dispatch(get_fobject_list())
    }, []);
    useEffect(() => {
        setNewFolder({ ...newFolder, vpath: current_path })
    }, [current_path]);
    useEffect(() => {
        setNewFolder({ ...newFolder, access: chipData })
    }, [chipData])

    return (
        <>
            <AppBar position="sticky">
                <Toolbar sx={{ backgroundColor: "background.secondary" }} >
                    <IconButton>
                        <Icon>
                            keyboard_backspace
                        </Icon>
                    </IconButton>
                    <Breadcrumbs sx={{ marginLeft: "20px" }} aria-label="breadcrumb" >
                        <Link underline="hover" color="inherit" onClick={navigate}>
                            MUI
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href=""
                        >
                            Core
                        </Link>
                        <Typography color="text.primary">Breadcrumbs</Typography>
                    </Breadcrumbs>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <IconButton
                        onClick={() => { toggleModal(true) }}
                    >
                        <Icon>
                            create_new_folder
                        </Icon>
                    </IconButton>
                    <IconButton>
                        <Icon>
                            upload_file
                        </Icon>
                    </IconButton>

                </Toolbar>
            </AppBar>
            <Modal
                open={modal}
                onClose={(e) => { toggleModal(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={style}>
                    <IconButton
                        sx={{ color: "red" }}
                        onClick={(e) => { toggleModal(false) }}
                    >
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography id="modal-modal-title" sx={{ textAlign: "center" }} variant="h6" component="h2">
                        New Folder
                    </Typography>
                    <Box sx={{ p: 4 }}>
                        <FormControl sx={{ width: "100%" }}>
                            <Input
                                placeholder="name"
                                onChange={e => setNewFolder({ ...newFolder, name: e.target.value })}
                                sx={{ marginTop: "20px" }}
                                startAdornment={<Icon sx={{ marginRight: "20px" }}>folder</Icon>}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "100%", marginTop: "20px" }}>
                            <ChipsArray
                                startAdornment={<Icon sx={{ marginRight: "20px" }}>person_add</Icon>}
                                placeholder="access"
                                chipData={chipData}
                                setChipData={setChipData} />
                        </FormControl>
                        <FormControlLabel
                            sx={{ marginTop: "10px", marginLeft: "2px" }}
                            label="public"
                            control={<>
                                <Icon>folder_shared</Icon>
                                <Checkbox
                                    onChange={e => setNewFolder({ ...newFolder, public: e.target.checked })}
                                />
                            </>
                            }
                        >
                        </FormControlLabel>
                        <FormControl sx={{ width: "100%" }}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ margin: "20px auto", width: "100%" }}
                                onClick={(e) => {
                                    let params = {...newFolder};
                                    if(params.vpath === "/")
                                        delete params.vpath;
                                    dispatch(create_folder(params))
                                        
                                }}
                            >
                                create
                            </Button>
                        </FormControl>
                    </Box>
                </Paper>
            </Modal>
            <Grid container sx={{ color: "text.primary" }}>
                {fobjects.map(f => {
                    return (
                        <Grid key={f._id} item xl={3} lg={4} sm={6} xs={12} sx={{ padding: "10px" }}>
                            <Card sx={{ width: "100%", borderRadius: "10px", backgroundColor: "background.primary" }}>
                                <CardHeader
                                    avatar={
                                        <Avatar

                                            onClick={() => { dispatch(toggleSelectItem({ fid: f._id })) }}
                                            sx={{ bgcolor: "text.primary", cursor: "pointer" }} aria-label="recipe">
                                            <Icon>{f.checked ? "check" : f.ftype === 0 ? "description" : f.ftype === 1 ? "folder" : "question_mark"}</Icon>
                                        </Avatar>
                                    }
                                    action={
                                        <>
                                            <IconButton
                                                onClick={(e) => {
                                                    setAnchorEl(e.target);
                                                    dispatch(toggleMenuItem({ fid: f._id }))
                                                }}
                                                aria-label="settings">
                                                <Icon>more_vert</Icon>
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={f.menu}
                                                onClose={() => dispatch(toggleMenuItem({ fid: f._id }))}
                                            >
                                                <MenuItem sx={{ padding: "10px" }}>
                                                    <Icon>lock_open</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        access control
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem sx={{ padding: "10px" }}>
                                                    <Icon>folder_shared</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        shared folder
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        dispatch(toggleSelectItem({ fid: f._id }))
                                                        dispatch(toggleMenuItem({ fid: f._id }))
                                                    }}
                                                    sx={{ padding: "10px" }}>
                                                    <Icon>check_box</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        select
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        let path = "";
                                                        if (f.vpath === "/")
                                                            path += f.name
                                                        else
                                                            path += "/" + f.name
                                                        dispatch(remove_fobject({ path }))
                                                    }}
                                                    sx={{ padding: "10px" }}>
                                                    <Icon>delete</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        remove
                                                    </Typography>
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    }
                                    title={f.name}
                                    subheader={f.createdAt}
                                />
                            </Card>
                        </Grid>)
                })
                }
            </Grid>
        </>
    )
}