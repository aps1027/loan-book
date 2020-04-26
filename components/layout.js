import React, { useEffect } from "react";
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
import NotificationsIcon from "@material-ui/icons/Notifications";
import clsx from "clsx";
import {
  Divider,
  Button,
  Menu,
  MenuItem,
  Badge,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser, useNotifications } from "../lib/hooks";
import moment from "moment";

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
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  progress: {
    width: "150px !important",
    height: "150px !important",
  },
  emptyBox: {
    flex: " 1 1 auto",
  },
  noti: {
    width: "300px",
    display: "block",
    position: "absolute",
    top: "65px",
    right: "100px",
    [theme.breakpoints.down("xs")]: {
      right: "10px",
    },
  },
  notiHead: {
    background: themeColor,
    height: "50px",
    color: "white",
  },
  notiCard: {
    width: "100%",
  },
  notiLink: {
    color: themeColor,
    fontSize: "12px",
    float: "left",
    textDecoration: "none",
    "&:hover": {
      opacity: 0.5,
    },
  },
  notiDate: {
    float: "right",
    fontSize: "12px",
    margin: "0px",
    fontWeight: "300",
  },
  notiDetail: {
    margin: "0px",
    fontWeight: "300",
  },
  divider: {
    margin: "10px 0px",
  },
  notReadNoti: {
    fontWeight: "500",
  },
  cardContent: {
    maxHeight: "560px",
    overflow: "auto",
  },
}));

export default function Layout(props) {
  const classes = useStyles();
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const [notifications] = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [openNoti, setOpenNoti] = React.useState(false);
  const [notiCount, setNotiCount] = React.useState(0);
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
  // To logout
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

  const onClickNoti = () => {
    setOpenNoti(!openNoti);
  };

  const onClickNotiDetail = async (event, noti_id, uri, read) => {
    event.preventDefault();
    if (!read) {
      const res = await fetch(`/api/noti`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notiId: noti_id }),
      });
    }
    router.replace(uri);
  };

  useEffect(() => {
    if (notifications) {
      const notiListToShow = notifications.filter(function (
        currentValue,
        index,
        array
      ) {
        if (currentValue.read.length) {
          return (
            currentValue.to_read.some(
              (element) => element.name === user.name
            ) && currentValue.read.some((ele) => ele.name !== user.name)
          );
        } else {
          return true;
        }
      });
      setNotiCount(notiListToShow.length);
    }
  }, [notifications]);

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
            <div>
              <IconButton color="inherit" onClick={onClickNoti}>
                <Badge badgeContent={notiCount} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
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
            {openNoti && (
              <Card className={classes.noti} id="notiBox">
                <CardHeader
                  title="Notifications"
                  className={classes.notiHead}
                />
                <CardContent className={classes.cardContent}>
                  {notifications && notifications.length ? (
                    notifications.reverse().map((noti, index) => (
                      <div key={index}>
                        <Grid container direction="row">
                          <Typography variant="h6" noWrap>
                            {noti.subject}
                          </Typography>
                          <Typography
                            paragraph
                            className={clsx(classes.notiDetail, {
                              [classes.notReadNoti]: !noti.read.some(
                                (ele) => ele.name === user.name
                              ),
                            })}
                          >
                            {noti.description}
                          </Typography>
                          <div className={classes.notiCard}>
                            <Typography
                              paragraph
                              className={clsx(classes.notiDate, {
                                [classes.notReadNoti]: !noti.read.some(
                                  (ele) => ele.name === user.name
                                ),
                              })}
                            >
                              {moment(noti.date).format("DD/MM/YYYY")}
                            </Typography>
                            <Link href={noti.uri}>
                              <a
                                className={classes.notiLink}
                                onClick={(e) =>
                                  onClickNotiDetail(
                                    e,
                                    noti._id,
                                    noti.uri,
                                    noti.read.some(
                                      (ele) => ele.name === user.name
                                    )
                                  )
                                }
                              >
                                Detail
                              </a>
                            </Link>
                          </div>
                        </Grid>
                        <Divider className={classes.divider}></Divider>
                      </div>
                    ))
                  ) : (
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      There is no notifications.
                    </Grid>
                  )}
                </CardContent>
              </Card>
            )}
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
