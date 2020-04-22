import { useLoanToGetById } from "../../lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Head from "next/head";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: "auto",
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
}));

const LoanIdPage = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const [loan] = useLoanToGetById(props.loanUrl);
  useEffect(() => {
    if (loan && loan.message) router.replace("/");
  }, [loan]);
  return (
    <Layout>
      <Head>
        <title>Loan Detail</title>
      </Head>
      <div className={classes.root}>
        {!loan || loan.message ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <p>{loan.borrowerInfo.borrower}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

LoanIdPage.getInitialProps = async function (context) {
  const { loanId } = context.query;
  return { loanUrl: `/api/loan/${loanId}` };
};

export default LoanIdPage;
