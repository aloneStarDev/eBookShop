import { AppBar, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Main from "./Pages/Main";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Icon from '@mui/material/Icon';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSideMenu, setJwt } from "./Redux/ConfigSlice";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
	const navigate = useNavigate();
	const thm = useSelector(state => state.config.theme);
	const sideMenu = useSelector(state => state.config.sideMenu);
	const jwt = useSelector(state => state.config.jwt);
	const dispach = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const logout = () => {
		dispach(setJwt(null));
		navigate("/login");
		handleClose();
	}

	return (
		<>
			<Box container sx={{ height:"100vh", bgcolor:"background.default" }}>
				<Box sx={{ flexGrow: 1 }}>
					<AppBar position="static">
						<Toolbar>
							{jwt ?
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
								Smart Storage
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
								<MenuItem onClick={handleClose}>Profile</MenuItem>
								<MenuItem onClick={logout}>Logout</MenuItem>
							</Menu>
						</Toolbar>
					</AppBar>
				</Box>
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
							<ListItemButton>
								<ListItemIcon>
									<Icon>manage_accounts</Icon>
								</ListItemIcon>
								user management
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<ListItemIcon>
									<Icon>folder</Icon>
								</ListItemIcon>
								file management
							</ListItemButton>
						</ListItem>
					</List>
				</Drawer>
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Routes>
			</Box>
		</>
	);
}

export default App;
