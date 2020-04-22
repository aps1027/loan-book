import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "../lib/hooks";
import {
  Container,
  TextField,
  Button,
  LinearProgress,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

const themeColor = "#1976d2";
const hoverColor = "#1976BE";
const useStyles = makeStyles((theme) => ({
  content: {
    display: "block",
  },
  contentShift: {
    display: "none",
  },
  card: {
    width: "285px",
    borderTop: "1px solid #E0E0E0",
    borderLeft: "1px solid #E0E0E0",
    margin: "30px auto",
    borderRight: "1px solid #E0E0E0",
  },
  cardContent: {
    paddingTop: "0px",
  },
  input: {
    width: "250px",
  },
  formControl: {
    marginBottom: "10px",
  },
  error: {
    margin: "0px 0px 10px 0px",
    color: "red",
  },
  btn: {
    backgroundColor: themeColor,
    "&:hover": {
      backgroundColor: hoverColor,
      opacity: 0.5,
    },
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [user, { mutate }] = useUser();
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: false,
    password: false,
  });

  const handleChange = (name) => (event) => {
    if (event.target.value.trim() !== "") {
      setErrors({
        ...errors,
        [name]: false,
      });
    } else {
      setErrors({
        ...errors,
        [name]: true,
      });
    }
  };
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.replace("/");
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    let tmpErrors = {
      email: false,
      password: false,
    };
    if (!e.currentTarget.email.value.trim()) {
      tmpErrors.email = true;
    } else {
      tmpErrors.email = false;
    }

    if (!e.currentTarget.password.value.trim()) {
      tmpErrors.password = true;
    } else {
      tmpErrors.password = false;
    }

    setErrors({
      ["email"]: tmpErrors.email,
      ["password"]: tmpErrors.password,
    });

    if (
      e.currentTarget.email.value.trim() &&
      e.currentTarget.password.value.trim()
    ) {
      setOpen(!open);
      const body = {
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      };
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        const userObj = await res.json();
        mutate(userObj);
      } else {
        setOpen(false);
        setErrorMsg("Incorrect email or password. Try again!");
      }
    }
  }

  return (
    <Container>
      <Head>
        <title>Sign in</title>
      </Head>
      <Card className={classes.card}>
        <CardHeader title="Sign in" />
        <CardContent className={classes.cardContent}>
          {errorMsg ? <p className={classes.error}>{errorMsg}</p> : null}
          <form onSubmit={onSubmit}>
            <FormControl error={errors.email} className={classes.formControl}>
              <TextField
                className={classes.input}
                label="Email"
                type="email"
                name="email"
                placeholder="Email address"
                variant="outlined"
                error={errors.email}
                onChange={handleChange("email")}
              />
              <FormHelperText>
                {errors.email ? "Email is required." : ""}
              </FormHelperText>
            </FormControl>
            <FormControl
              error={errors.password}
              className={classes.formControl}
            >
              <TextField
                className={classes.input}
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                variant="outlined"
                autoComplete="on"
                error={errors.password}
                onChange={handleChange("password")}
              />
              <FormHelperText>
                {errors.password ? "Password is required." : ""}
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              className={classes.btn}
            >
              Sign in
            </Button>
          </form>
        </CardContent>
        {open ? <LinearProgress color="secondary" /> : null}
      </Card>
    </Container>
  );
};

export default LoginPage;
