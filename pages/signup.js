import React, { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import { useUser } from "../lib/hooks";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  TextField,
  makeStyles,
  FormHelperText,
  Button,
} from "@material-ui/core";
import Loading from "../components/loading";
import Welcome from "../components/welcome";

const loadingCount = process.env.LOADING_COUNT;
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

const SignupPage = () => {
  const classes = useStyles();
  const [user, { mutate }] = useUser();
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = React.useState({
    name: false,
    email: false,
    password: false,
  });
  const [loading, setloading] = React.useState(true);
  setInterval(function () {
    setloading(false);
  }, loadingCount * 1000);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      Router.replace("/");
    } else {
      setErrorMsg(await res.text());
    }
  };
  if (user) {
    return (
      <Container>
        <Head>
          <title>Sign up</title>
        </Head>
        <Card className={classes.card}>
          <CardHeader title="Sign up" />
          <CardContent className={classes.cardContent}>
            {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
            <form onSubmit={handleSubmit}>
              <FormControl error={errors.name} className={classes.formControl}>
                <TextField
                  className={classes.input}
                  label="Name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  variant="outlined"
                  error={errors.name}
                  onChange={handleChange("name")}
                />
                <FormHelperText>
                  {errors.name ? "Name is required." : ""}
                </FormHelperText>
              </FormControl>
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
                Sign up
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    );
  }
  return <>{loading ? <Loading></Loading> : <Welcome></Welcome>}</>;
};

export default SignupPage;
