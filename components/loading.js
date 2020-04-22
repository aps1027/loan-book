import {
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  progress: {
    width: "150px !important",
    height: "150px !important",
  },
  loading: {
    display: "block",
    width: "100%",
    padding: theme.spacing(10),
    zIndex: 3,
    textAlign: "center",
  },
}));

export default function Loading() {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>Loan Book</title>
      </Head>
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} color="secondary" />
      </div>
    </>
  );
}
