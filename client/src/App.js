import { AppBar, CssBaseline, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Main from "./Pages/Main";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserManagement from "./Pages/UserManagement";
import Icon from '@mui/material/Icon';
import "./App.css"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSideMenu } from "./Redux/ConfigSlice";
import { setJwt } from "./Redux/RequestSlice";
import { Route, Routes, useNavigate } from "react-router-dom";
import { setUser } from './Redux/UserSlice';
import Profile from './Pages/Profile';

function App() {
	const navigate = useNavigate();
	const thm = useSelector(state => state.config.theme);
	const sideMenu = useSelector(state => state.config.sideMenu);
	const jwt = useSelector(state => state.request.jwt);
	const role = useSelector(state => state.user.data.role);
	const dispach = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const profile = () => {
		navigate("/profile");
		handleClose();
	}
	const logout = () => {
		dispach(setJwt(null));
		dispach(setUser(null));
		navigate("/login");
		handleClose();
	}

	return (
		<>
			<CssBaseline />
			<AppBar position="sticky">
				<Toolbar>
					{jwt &&
						role === 2 ?
						<IconButton
							onClick={e => dispach(toggleSideMenu())}
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<Icon>menu</Icon>
						</IconButton> : ""
					}
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						<Link
							href="/"
							underline="hover"
							color="inherit"
							style={{ cursor: "pointer" }}
						>
							Smart Storage
						</Link>
					</Typography>
					<IconButton color="inherit" onClick={e => dispach(toggleTheme())}>
						<Icon>{thm === "dark" ? 'dark_mode' : 'light_mode'}</Icon>
					</IconButton>
					{jwt ?
						<IconButton color="inherit" onClick={e => handleMenu(e)}>
							<Icon>account_circle</Icon>
						</IconButton> : <></>
					}
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem onClick={profile}>Profile</MenuItem>
						<MenuItem onClick={logout}>Logout</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<Drawer
				anchor="left"
				open={sideMenu}
				onClose={e => dispach(toggleSideMenu())}
			>
				<List>
					<ListItem>
						<IconButton onClick={e => dispach(toggleSideMenu())}>
							<Icon>chevron_left</Icon>
						</IconButton>
					</ListItem>
					<Divider />
					<ListItem>
						<ListItemButton
							onClick={e => navigate("/manage/user")}
						>
							<ListItemIcon>
								<Icon>manage_accounts</Icon>
							</ListItemIcon>
							user management
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							onClick={e => navigate("/")}
						>
							<ListItemIcon>
								<Icon>folder</Icon>
							</ListItemIcon>
							file management
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<Box >
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="profile" element={<Profile />} />
					{role === 2 && <Route path="manage/user" element={<UserManagement />} />}
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Routes>
			</Box>
		</>
	);
}

export default App;
