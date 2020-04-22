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
import { Divider } from "@material-ui/core";
import Link from "next/link";

const drawerWidth = 240;
const themeColor = "#1976d2";
const hoverColor = "#1976BE";
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
    flexShrink: 0,
    position: "fixed",
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
    zIndex: -1,
    position: "relative",
    [theme.breakpoints.up("lg")]: {
      zIndex: "auto",
    },
  },
  contentShift: {
    zIndex: 0,
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
    backgroundColor: themeColor,
    "&:hover": {
      backgroundColor: hoverColor,
      opacity: 0.5,
    },
  },
  progress: {
    width: "150px !important",
    height: "150px !important",
  },
}));

export default function Layout(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpenOrClose = () => {
    setOpen(!open);
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
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: !open,
          })}
        >
          <div className={classes.drawerHeader} />
          {props.children}
        </main>
      </div>
    </>
  );
}
