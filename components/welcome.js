import React, { useEffect } from "react";
import { CssBaseline, Typography, makeStyles } from "@material-ui/core";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "../lib/hooks";

const themeColor = "#1976d2";
const hoverColor = "#1976BE";
const useStyles = makeStyles((theme) => ({
  message: {
    margin: "auto",
    textAlign: "center",
    padding: theme.spacing(4, 0),
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
  const router = useRouter();
  const [user] = useUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user) router.replace("/");
  }, [user]);

  const classes = useStyles();
  return (
    <div className={classes.message}>
      <Head>
        <title>Loan Book</title>
      </Head>
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
