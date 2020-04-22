import React from "react";
import { CssBaseline, Typography, makeStyles } from "@material-ui/core";
import Link from "next/link";

const themeColor = "#1976d2";
const hoverColor = "#1976BE";
const useStyles = makeStyles((theme) => ({
  message: {
    margin: "auto",
    textAlign: "center",
    padding: theme.spacing(4),
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
  msgHead: {
    color: themeColor,
    margin: theme.spacing(0, 1),
  },
  paragraph: {
    margin: theme.spacing(0, 2),
  },
  anchor: {
    color: themeColor,
    "&:hover": {
      color: hoverColor,
      opacity: 0.5,
    },
    paddingRight: theme.spacing(0.5),
  },
}));

export default function Welcome() {
  const classes = useStyles();
  return (
    <div className={classes.message}>
      <CssBaseline />
      <Typography variant="h2" className={classes.msgHead}>
        Hello!!!
      </Typography>
      <Typography paragraph className={classes.paragraph}>
        Welcome from Loan Book Trace App.
      </Typography>
      <Typography paragraph className={classes.paragraph}>
        <Link href="/login">
          <a className={classes.anchor}>Sign in</a>
        </Link>
        , if you have account.
      </Typography>
    </div>
  );
}
