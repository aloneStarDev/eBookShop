import { Button, ButtonGroup, Checkbox, Container, Fab, FormControl, FormControlLabel, FormLabel, Icon, IconButton, Input, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { add_user, edit_user, list_user, remove_user } from "../Redux/RequestSlice"
import { useDispatch, useSelector } from "react-redux"
import React, { useState, useEffect } from "react";
import { setUsers, checkUser, checkAllUser } from "../Redux/UserManagementSlice";


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

export default function UserManagement() {
    let dispatch = useDispatch();
    let rows = useSelector(store => store.users.data);
    const [saveModal, setSaveModal] = useState(false);
    const [currentUser, setCurrnetUser] = useState({
        identifier: null,
        data: {
            name: '',
            username: '',
            password: '',
            email: '',
            verify: false
        }
    });
    const [modalType, setModalType] = useState("edit");
    const [removeBtn, setRemoveBtn] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    useEffect(() => {
        dispatch(list_user());
    }, []);
    useEffect(() => {
        setSaveModal(false);
        setCurrnetUser({
            identifier: null,
            data: {
                name: '',
                username: '',
                password: '',
                email: '',
                verify: false
            }
        });
        setModalType("edit");

        let checked_count = 0;
        rows.forEach(x => x.checked && checked_count++);
        if (checked_count === rows.length)
            setSelectAll(true);
        else
            setSelectAll(false);
        if (checked_count !== 0)
            setRemoveBtn(true);
        else
            setRemoveBtn(false);
    }, [rows]);

    const chagneCheck = (item) => {
        let checked_count = 0;
        rows.forEach(x => {
            if (x.username === item.username)
                dispatch(checkUser({ username: x.username, value: !x.checked }));
            if (x.checked)
                checked_count += 1;
            return x;
        });

        setRemoveBtn(checked_count !== 0)
    };
    const checkAll = (e) => {
        if (!selectAll) {
            dispatch(checkAllUser({ value: true }));
        } else {
            dispatch(checkAllUser({ value: false }));
        }
    };
    const handleSaveModal = (e) => {
        if (modalType === "New") {
            dispatch(add_user(currentUser.data));
        } else if (modalType === "Edit") {
            let edited = {}
            let actual_user_index = rows.findIndex(x => x.username === currentUser.identifier)
            let actual_user = rows[actual_user_index];
            for (let i in actual_user) {
                if (actual_user[i] !== currentUser.data[i]) {
                    edited[i] = currentUser.data[i];
                }
            }
            edited.uid = currentUser.identifier;
            dispatch(edit_user(edited));
        }
    };
    const handleRemoveItem = (e) => {
        let selected_users = rows.filter(x => x.checked).map(x => x.username);
        dispatch(remove_user({ usernames: selected_users }));
    };
    return (<div>
        <>
            <Fab
                onClick={() => {
                    setModalType("New");
                    setCurrnetUser({
                        identifier: null,
                        data: {
                            name: '',
                            username: '',
                            password: '',
                            email: '',
                            verify: false
                        }
                    });
                    setSaveModal(true);
                }}
                color="secondary"
                sx={{
                    position: "fixed",
                    right: "30px",
                    bottom: "30px"
                }}
            >
                <Icon>person_add</Icon>
            </Fab>
            {removeBtn &&
                <Fab
                    onClick={handleRemoveItem}
                    color="error"
                    sx={{
                        position: "fixed",
                        right: "30px",
                        bottom: "100px"
                    }}
                >
                    <Icon>delete_forever</Icon>
                </Fab>
            }

            <Modal
                open={saveModal}
                onClose={(e) => { setSaveModal(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={style}>
                    <IconButton
                        sx={{ color: "red" }}
                        onClick={(e) => { setSaveModal(false) }}
                    >
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography id="modal-modal-title" sx={{ textAlign: "center" }} variant="h6" component="h2">
                        {modalType} User
                    </Typography>
                    <Box sx={{ p: 4 }}>
                        <FormControl
                            sx={{ width: "100%" }}
                        >
                            <Input
                                placeholder="name"
                                value={currentUser.data.name}
                                onChange={e => setCurrnetUser({ ...currentUser, data: { ...currentUser.data, name: e.target.value } })}
                                sx={{ marginTop: "20px" }}
                                startAdornment={<Icon sx={{ padding: "10px" }}>badge</Icon>}
                            />
                        </FormControl>
                        <FormControl
                            sx={{ width: "100%" }}
                        >
                            <Input
                                placeholder="username"
                                value={currentUser.data.username}
                                onChange={e => setCurrnetUser({ ...currentUser, data: { ...currentUser.data, username: e.target.value } })}
                                sx={{ marginTop: "10px" }}
                                startAdornment={<Icon sx={{ padding: "10px" }}>person</Icon>}
                            />
                        </FormControl>
                        <FormControl
                            sx={{ width: "100%" }}
                        >
                            <Input
                                placeholder="email"
                                value={currentUser.data.email}
                                onChange={e => setCurrnetUser({ ...currentUser, data: { ...currentUser.data, email: e.target.value } })}
                                sx={{ marginTop: "10px" }}
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
                                value={currentUser.data.password}
                                onChange={e => setCurrnetUser({ ...currentUser, data: { ...currentUser.data, password: e.target.value } })}
                                startAdornment={<Icon sx={{ padding: "10px" }}>key</Icon>}
                            />
                        </FormControl>
                        <FormControlLabel
                            sx={{ marginTop: "10px", marginLeft: "10px" }}
                            label="verify"
                            control={<>
                                <Icon>verified</Icon>
                                <Checkbox
                                    checked={currentUser.data.verify}
                                    onClick={e => setCurrnetUser({ ...currentUser, data: { ...currentUser.data, verify: !currentUser.data.verify } })}
                                />
                            </>
                            }
                        >
                        </FormControlLabel>
                        <FormControl
                            sx={{ width: "100%" }}

                        >

                            <Button
                                variant="contained"
                                color="success"
                                sx={{ margin: "20px auto", width: "100%" }}
                                onClick={handleSaveModal}
                            >
                                save
                            </Button>
                        </FormControl>
                    </Box>
                </Paper>
            </Modal>
            <Container>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        checked={selectAll}
                                        onClick={() => { checkAll() }}
                                        checkedIcon={(<Icon>indeterminate_check_box</Icon>)}
                                    />
                                </TableCell>
                                <TableCell>name</TableCell>
                                <TableCell>username</TableCell>
                                <TableCell>email</TableCell>
                                <TableCell>verified</TableCell>
                                <TableCell>action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.username} >
                                    <TableCell>
                                        <Checkbox checked={row.checked} onClick={(e) => chagneCheck(row)} />
                                    </TableCell>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.verify ? <Icon>check</Icon> : <Icon>close</Icon>} </TableCell>
                                    <TableCell>
                                        <ButtonGroup>
                                            <Button size="small" color="warning" variant="contained"
                                                onClick={(e) => dispatch(remove_user({ usernames: [row.username] }))}
                                            >
                                                delete
                                            </Button>
                                            <Button size="small" color="info" variant="contained"
                                                onClick={() => {
                                                    setModalType("Edit");
                                                    setCurrnetUser({ identifier: row.username, data: row });
                                                    setSaveModal(true);
                                                }}
                                            >
                                                edit
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    </div >);
}