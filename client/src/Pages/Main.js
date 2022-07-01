import { AppBar, Autocomplete, Avatar, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Chip, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Icon, IconButton, Input, LinearProgress, Link, Menu, MenuItem, Modal, Paper, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { change_access, create_folder, get_fobject_list, move_fobject, remove_fobject, toggle_public_access } from "../Redux/RequestSlice";
import { cd, setDownloadValue, toggleMenuItem, toggleSelectItem, unSelectAllItems } from "../Redux/StorageSlice";
import ChipsArray from "../Components/InputWithChip";
import { useSnackbar } from "notistack";
import zIndex from "@mui/material/styles/zIndex";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'text.default',
    border: '2px solid white',
    borderRadius: "15px",
    p: 4,
};

export default function Main() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const jwt = useSelector(state => state.request.jwt);
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch()
    const fobjects = useSelector(state => state.storage.current);
    const current_path = useSelector(state => state.storage.path);
    const parent = useSelector(state => state.storage.current_parent);
    const fs = useSelector(state => state.storage.fs);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectMode, toggleSelectMode] = useState(false);
    const [modal, toggleModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalStyle, setModalStyle] = useState(style);
    const [chipData, setChipData] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploadValue, setUploadValue] = useState(0);
    const [chipFiles, setChipFiles] = useState([]);
    const [modalData, setModalData] = useState({ name: "", public: false });

    const navigate = useNavigate();
    const handle_move = (from, to) => {
        let selected = [from];
        if (selectMode)
            selected.push(...fobjects.filter(x => x.checked).map(x => x._id));
        selected = [...(new Set(selected))];
        if (selected.includes(to)) {
            let sid = enqueueSnackbar("can't move one folder to him self", { variant: "error" });
            setTimeout(() => { closeSnackbar(sid) }, 1000);
        } else {
            dispatch(move_fobject({ fids: selected, target: to }))
        }
    }
    const handle_move_by_name = (from, index) => {
        let path = current_path.split("/");
        if (index === 0)
            handle_move(from, "/");
        else {
            let path_covrage = path.filter((item, i) => index >= i);
            path_covrage[0] = "/";
            let target = path_covrage[path_covrage.length - 1];
            let check_node = { name: "/", _id: "/" }
            let current_depth_parent = "/";
            let i = 1;
            while (check_node.name !== target) {
                check_node = fs.find(x => x.parent === current_depth_parent && x.name === path_covrage[i]);
                current_depth_parent = check_node._id;
                i++;
            }
            handle_move(from, check_node._id);
        }
    }
    const handleChangeDir = (index) => {
        let path = current_path.split("/");
        if (index === 0)
            dispatch(cd("/"));
        else {
            let path_covrage = path.filter((item, i) => index >= i);
            path_covrage[0] = "/";
            let target = path_covrage[path_covrage.length - 1];
            let check_node = { name: "/", _id: "/" }
            let current_depth_parent = "/";
            let i = 1;
            while (check_node.name !== target) {
                check_node = fs.find(x => x.parent === current_depth_parent && x.name === path_covrage[i]);
                current_depth_parent = check_node._id;
                i++;
            }
            dispatch(cd(check_node._id))
        }
    }
    const handleBackPress = (e) => {
        if (current_path === "/") {
            let snackbarId = enqueueSnackbar("can't going upper than this");
            setTimeout(() => {
                closeSnackbar(snackbarId);
            }, 1000);
        }
        else {
            let path = current_path.split("/");
            path.splice(path.length - 1, 1);
            let path_covrage = path;
            path_covrage[0] = "/";
            let target = path_covrage[path_covrage.length - 1];
            let check_node = { name: "/", _id: "/" }
            let current_depth_parent = "/";
            let i = 1;
            while (check_node.name !== target) {
                check_node = fs.find(x => x.parent === current_depth_parent && x.name === path_covrage[i]);
                current_depth_parent = check_node._id;
                i++;
            }
            dispatch(cd(check_node._id))
        }
    };
    const onSelectFile = (e) => {
        let found = -1
        let new_files = [...e.target.files]
        new_files.map(f => {
            if (chipFiles.includes(f.name))
                found += 1
        })
        if (found != -1) {
            let sid = enqueueSnackbar("can't upload 2 file with same name", { variant: "warning" });
            setTimeout(() => {
                closeSnackbar(sid);
            }, 1000);
        } else {
            setFiles([...files, ...new_files])
        }
        e.target.value = "";
    }
    const handleChangeAccess = (fitem) => {
        setChipData(fitem.access);
        setModalData({ ...modalData, name: fitem._id });
        setModalType("Change Access");
        toggleModal(true);
    };
    const uploadFileHandler = () => {
        let formdata = new FormData();
        formdata.append("public", modalData.public);
        formdata.append("parent", parent);
        formdata.append("access", JSON.stringify(chipData));
        for (let i in files) {
            formdata.append("files", files[i]);
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.responseText) {
                    let result = JSON.parse(xhr.responseText);
                    let snackbar_key = 0;
                    if (result.ok) {
                        snackbar_key = enqueueSnackbar(`${files.length} uploaded successfully`, { variant: "success" });
                        dispatch(get_fobject_list());
                    } else {
                        if (result.error) {
                            snackbar_key = enqueueSnackbar(`${result.error}`, { variant: "error" });
                        } else
                            snackbar_key = enqueueSnackbar(`failed to upload all items`, { variant: "error" });
                        dispatch(get_fobject_list());
                    }
                    toggleModal(false);
                    setTimeout(() => closeSnackbar(snackbar_key), 1000);

                }
            }
        }
        xhr.open('POST', "/api/fobject/file/add", true);
        xhr.upload.onprogress = function (evt) {
            if (evt.lengthComputable) {
                let progress = Math.ceil((evt.loaded / evt.total) * 100);
                setUploadValue(progress);
            }
        };
        xhr.onabort = (e) => {
            let sid = enqueueSnackbar("upload aborted", { variant: "warning" });
            setTimeout(() => closeSnackbar(sid), 1000);
            setUploadValue(0);
        };
        let abort_listener = (e) => {
            xhr.abort();
            document.removeEventListener("abort-upload", abort_listener);
        };
        document.addEventListener("abort-upload", abort_listener)
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send(formdata);
    }
    const downloadFile = (fitem) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "/api/fobject/file/download/" + fitem._id, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            let item_uri = URL.createObjectURL(xhr.response);
            let fileLink = document.createElement('a');
            fileLink.href = item_uri;
            fileLink.download = fitem.name;
            fileLink.click();
            dispatch(setDownloadValue({ fid: fitem._id, value: 0 }));
            let sid = enqueueSnackbar("download complete", { variant: "success" });
            setTimeout(() => closeSnackbar(sid), 1000);
        };
        xhr.onprogress = function (evt) {
            if (evt.lengthComputable) {
                let progress = Math.ceil((evt.loaded / evt.total) * 100);
                dispatch(setDownloadValue({ fid: fitem._id, value: progress }));
            }
        };
        xhr.onabort = (e) => {
            let sid = enqueueSnackbar("download aborted", { variant: "warning" });
            setTimeout(() => closeSnackbar(sid), 1000);
            dispatch(setDownloadValue({ fid: fitem._id, value: 0 }));
        };
        let abort_listener = (e) => {
            xhr.abort();
            document.removeEventListener(`abort-download-${fitem._id}`, abort_listener);
        };
        document.addEventListener(`abort-download-${fitem._id}`, abort_listener)
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
    }
    useEffect(() => {
        if (jwt === null)
            navigate("/login");
        else
            dispatch(get_fobject_list())
    }, []);
    useEffect(() => {
        setChipFiles(files.map(f => f.name));
    }, [files]);
    useEffect(() => {
        if (chipFiles.length < files.length) {
            let new_files = files.filter(x => {
                if (chipFiles.includes(x.name))
                    return x;
            })
            setFiles(new_files);
        }
    }, [chipFiles]);
    useEffect(() => {
        setChipData([]);
        setModalData({ name: "", public: false });
        setModalType("")
        setModalStyle(style);
        setFiles([]);
        setChipFiles([]);
        setUploadValue(0);
        toggleModal(false);
        let checked_count = 0;
        fobjects.forEach(x => x.checked && checked_count++)
        if (checked_count)
            toggleSelectMode(true);
        else
            toggleSelectMode(false);
    }, [fobjects]);
    return (
        <>
            <AppBar position="sticky">
                <Toolbar sx={{ backgroundColor: "background.secondary" }} >
                    <IconButton onClick={handleBackPress}>
                        <Icon>
                            keyboard_backspace
                        </Icon>
                    </IconButton>
                    <Breadcrumbs sx={{ marginLeft: "20px" }} aria-label="breadcrumb" separator="/">
                        {
                            current_path === "/" ?
                                <Typography color="text.primary">/</Typography> :
                                current_path.split("/").map((p, i) => {
                                    if (i === 0) {
                                        p = <Typography mt={0.9}>
                                            <Icon fontSize="small">home</Icon>
                                        </Typography>
                                    }
                                    else if (p === "") {
                                        p = <Typography mt={0.9}>
                                            <Icon fontSize="small">keyboard_double_arrow_right</Icon>
                                        </Typography>
                                    }

                                    return (
                                        <Link
                                            onDragOver={(e) => { e.preventDefault() }}
                                            onDrop={(e) => { handle_move_by_name(e.dataTransfer.getData("fid"), i) }}
                                            key={i}
                                            underline="hover"
                                            color="inherit"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                handleChangeDir(i);
                                            }}
                                        >
                                            {p}
                                        </Link>
                                    );

                                })
                        }

                    </Breadcrumbs>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    {
                        selectMode &&
                        <IconButton
                            onClick={() => { toggleSelectMode(false); dispatch(unSelectAllItems()) }}
                        >
                            <Icon>
                                disabled_by_default
                            </Icon>
                        </IconButton>
                    }
                    <IconButton
                        onClick={() => {
                            setModalType("New Folder")
                            toggleModal(true);
                        }}
                    >
                        <Icon>
                            create_new_folder
                        </Icon>
                    </IconButton>
                    <IconButton onClick={() => {
                        setModalType("Upload Files")
                        toggleModal(true);
                    }}>
                        <Icon>
                            upload_file
                        </Icon>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Modal
                open={modal}
                onClose={(e) => {
                    if (modalType === "Upload Files" && uploadValue !== 0) {
                        enqueueSnackbar(`upload already in progress`, {
                            variant: "warning", action: (key) => (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        document.dispatchEvent(new Event("abort-upload"));
                                        closeSnackbar(key);
                                    }}
                                >cancel upload
                                </Button>
                            ),
                            persist: true,
                        })
                    }
                    toggleModal(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={modalStyle}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (modalType === "Upload Files")
                            setModalStyle({ ...modalStyle, border: "2px dashed red" });
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        if (modalType === "Upload Files")
                            setModalStyle({ ...modalStyle, border: "2px solid white" });
                    }}
                    onDrop={(e) => {
                        e.preventDefault();

                        if (modalType === "Upload Files") {
                            let new_files = [...e.dataTransfer.files];
                            let found = new_files.findIndex(x => {
                                if (files.map(f => f.name).includes(x.name))
                                    return true;
                            });
                            if (found != -1) {
                                let sid = enqueueSnackbar("can't upload 2 file with same name", { variant: "warning" });
                                setTimeout(() => {
                                    closeSnackbar(sid);
                                }, 1000);
                            } else {
                                setFiles([...files, ...new_files])
                                setModalStyle({ ...modalStyle, border: "2px solid white" });
                            }
                        }
                    }}
                >
                    <IconButton
                        sx={{ color: "red" }}
                        onClick={(e) => {
                            if (modalType === "Upload Files" && uploadValue !== 0) {
                                enqueueSnackbar("upload already in progress", {
                                    variant: "warning", action: (key) => (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                document.dispatchEvent(new Event("abort-upload"));
                                                closeSnackbar(key);
                                            }}
                                        >cancel upload
                                        </Button>
                                    ),
                                    persist: true
                                })
                            }
                            toggleModal(false)
                        }}
                    >
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography id="modal-modal-title" sx={{ textAlign: "center" }} variant="h6" component="h2">
                        {modalType}
                    </Typography>
                    <Box sx={{ p: 4 }}>
                        {
                            modalType === "Upload Files" &&
                            (
                                <>
                                    <FormControl sx={{ width: "100%" }}>
                                        <ChipsArray
                                            InputElement={
                                                <FormControl sx={{ width: "100%" }}>
                                                    <input id="select-file-input" onChange={onSelectFile} type="file" style={{ display: "none" }} multiple />
                                                    <label
                                                        htmlFor="select-file-input"
                                                    >

                                                        <Button variant="outlined" component="span" style={{ width: "100%" }}>Select File</Button>
                                                    </label>
                                                </FormControl>
                                            }
                                            chipData={chipFiles}
                                            setChipData={setChipFiles}
                                            itemPlaceholder="files"
                                        />

                                    </FormControl>
                                </>
                            )
                        }
                        {
                            modalType === "New Folder" &&
                            <FormControl sx={{ width: "100%" }}>
                                <Input
                                    placeholder="name"
                                    onChange={e => setModalData({ ...modalData, name: e.target.value })}
                                    sx={{ marginTop: "20px" }}
                                    startAdornment={<Icon sx={{ marginRight: "20px" }}>folder</Icon>}
                                />
                            </FormControl>
                        }
                        <FormControl sx={{ width: "100%", marginTop: "20px" }}>
                            <ChipsArray
                                startAdornment={<Icon sx={{ marginRight: "20px" }}>person_add</Icon>}
                                itemPlaceholder="access list"
                                placeholder="username to access"
                                chipData={chipData}
                                setChipData={setChipData} />
                        </FormControl>
                        {
                            modalType !== "Change Access" &&
                            <FormControlLabel
                                sx={{ marginTop: "10px", marginLeft: "2px" }}
                                label="public"
                                control={<>
                                    <Icon>folder_shared</Icon>
                                    <Checkbox
                                        onChange={e => setModalData({ ...modalData, public: e.target.checked })}
                                    />
                                </>
                                }
                            >
                            </FormControlLabel>
                        }
                        <FormControl sx={{ width: "100%" }}>
                            {
                                uploadValue === 0 ?
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ margin: "20px auto", width: "100%" }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (modalType === "Change Access") {
                                                let params = { fid: modalData.name, access: chipData };
                                                dispatch(change_access(params));
                                                toggleModal(false);
                                            } else if (modalType === "Upload Files") {
                                                uploadFileHandler();
                                            } else if (modalType === "New Folder") {
                                                let params = { ...modalData };
                                                params.parent = parent;
                                                if (chipData.length !== 0)
                                                    params.access = chipData;
                                                if (fobjects.findIndex(x => x.name === params.name) === -1) {
                                                    dispatch(create_folder(params));
                                                    toggleModal(false);
                                                } else {
                                                    let sid = enqueueSnackbar("this folder already exist !", { variant: "error" });
                                                    setTimeout(() => {
                                                        closeSnackbar(sid);
                                                    }, 1000);
                                                }
                                            }
                                        }}
                                    >
                                        {
                                            uploadValue !== 0 ? "Cancel Upload" :
                                                modalType === "Change Access" ? "save" :
                                                    modalType === "New Folder" ? "create" :
                                                        modalType === "Upload Files" ? "upload" : ""
                                        }
                                    </Button> :
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ margin: "20px auto", width: "100%" }}
                                        onClick={() => {
                                            document.dispatchEvent(new Event("abort-upload"));
                                        }}
                                    >
                                        cancel upload
                                    </Button>
                            }
                            {
                                modalType === "Upload Files" && uploadValue !== 0 &&
                                <FormControl sx={{ width: "100%" }}>
                                    <LinearProgress variant="determinate" value={uploadValue} />
                                </FormControl>
                            }
                        </FormControl>
                    </Box>
                </Paper>
            </Modal>
            <Grid container sx={{ color: "text.primary" }}>

                {fobjects.map(f => {
                    return (
                        <Grid
                            key={f._id} item xl={3} lg={4} sm={6} xs={12} sx={{ padding: "10px" }}>
                            <Card
                                onDragStart={(ev) => {
                                    ev.dataTransfer.setData("fid", f._id);
                                    ev.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(ev) => {
                                    if (f.ftype === 1) {
                                        ev.preventDefault();
                                    }
                                }}
                                onDrop={(ev) => {
                                    let data = ev.dataTransfer.getData("fid");
                                    handle_move(data, f._id);
                                }}
                                draggable={true}
                                sx={{ width: "100%", borderRadius: "10px", backgroundColor: "background.primary" }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            onClick={() => {
                                                if (selectMode) {
                                                    dispatch(toggleSelectItem({ fid: f._id }))
                                                } else {
                                                    if (f.ftype === 0) {
                                                        if (f.downloadValue !== 0)
                                                            document.dispatchEvent(new Event(`abort-download-${f._id}`));
                                                        else
                                                            downloadFile(f);
                                                    }
                                                    else
                                                        dispatch(cd(f._id))
                                                }
                                            }}
                                            sx={{ bgcolor: "text.primary", cursor: "pointer" }} aria-label="recipe">
                                            {f.downloadValue !== 0 ?
                                                (
                                                    <>
                                                        <CircularProgress variant="determinate" value={f.downloadValue} sx={{ position: "absolute", color: "background.default" }} />
                                                        <Icon>close</Icon>
                                                    </>
                                                ) :
                                                (<Icon>{f.checked ? "check" : f.ftype === 0 ? "description" : f.ftype === 1 ? (f.public ? "share" : (f.owner === user._id ? "folder" : "folder_shared")) : "question_mark"}</Icon>)
                                            }
                                        </Avatar>
                                    }
                                    action={
                                        <>
                                            <IconButton
                                                onClick={(e) => {
                                                    setAnchorEl(e.target);
                                                    dispatch(toggleMenuItem({ fid: f._id }));
                                                }}
                                                aria-label="settings">
                                                <Icon>more_vert</Icon>
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={f.menu}
                                                onClose={() => dispatch(toggleMenuItem({ fid: f._id }))}
                                            >
                                                <MenuItem
                                                    onClick={(e) => handleChangeAccess(f)}
                                                    sx={{ padding: "10px" }}>
                                                    <Icon>lock_open</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        access control
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem sx={{ padding: "10px" }}
                                                    onClick={() => {
                                                        dispatch(toggle_public_access({ fid: f._id }))
                                                    }}
                                                >
                                                    <Icon>share</Icon>
                                                    <Typography sx={{ marginLeft: 2 }}>
                                                        share folder
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
                                                        dispatch(remove_fobject({ fid: f._id }))
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
                        </Grid>
                    )
                })
                }

            </Grid>
        </>
    )
}