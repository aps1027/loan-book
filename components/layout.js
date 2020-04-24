import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CreateIcon from "@material-ui/icons/Create";
import HomeIcon from "@material-ui/icons/Home";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Divider, Button, Menu, MenuItem } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../lib/hooks";

const drawerWidth = 240;
const themeColor = "#1976d2";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
  },
  appBar: {
    backgroundColor: themeColor,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuTitle: {
    padding: "10px 15px",
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    top: 64,
    [theme.breakpoints.down("xs")]: {
      top: 57,
    },
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    display: "block",
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    position: "relative",
  },
  loading: {
    display: "block",
    position: "absolute",
    height: "100%",
    width: "100%",
    padding: "175px 0px",
    background: "#E0E0E0",
    opacity: 0.75,
    zIndex: 3,
    textAlign: "center",
  },
  loadingShift: {
    display: "none",
  },
  welcome: {
    margin: "auto",
    padding: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "820px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "820px",
    },
  },
  welcomeShift: {
    display: "none",
  },
  paragraph: {
    margin: "15px 0px",
  },
  btn: {
    color: "white",
  },
  progress: {
    width: "150px !important",
    height: "150px !important",
  },
  emptyBox: {
    flex: " 1 1 auto",
  },
}));

export default function Layout(props) {
  const classes = useStyles();
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpenOrClose = () => {
    setOpen(!open);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const routeLink = (link) => {
    router.replace(link);
  };
  const handleLogout = async () => {
    const res = await fetch("/api/auth", {
      method: "DELETE",
    });
    if (res.status === 204) {
      // set the user state to null
      mutate(null);
      router.replace("/");
    }
  };

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenOrClose}
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Loan Book
            </Typography>
            <div className={classes.emptyBox}></div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              color="primary"
              onClick={handleClick}
              className={classes.btn}
              endIcon={<ExpandMoreIcon />}
            >
              {user ? user.name : "loading..."}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={(e) => {
                  handleClose();
                  routeLink("/signup");
                }}
              >
                Sign up
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleClose();
                  handleLogout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Typography className={classes.menuTitle} variant="h6" noWrap>
            Menu
          </Typography>
          <Divider />
          <List>
            <Link href="/">
              <ListItem button key="Home">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link href="/calculator">
              <ListItem button key="Calculator">
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="Calculator" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.drawerHeader} />
          {props.children}
        </main>
      </div>
    </>
  );
}
