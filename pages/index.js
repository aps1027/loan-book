import Layout from "../components/layout";
import {
  makeStyles,
  withStyles,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Table,
  TableBody,
  Paper,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import { useUser, useLoans } from "../lib/hooks";
import Welcome from "../components/welcome";
import Loading from "../components/loading";
import Link from "next/link";

const loadingCount = process.env.LOADING_COUNT;
const themeColor = "#1976d2";
const hoverColor = "#1976BE";
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: themeColor,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

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
  tableContainer: {
    width: "100%",
    display: "block",
    margin: theme.spacing(1, 0),
  },
  anchor: {
    color: themeColor,
    textDecoration: "none",
    "&:hover": {
      color: hoverColor,
      opacity: 0.5,
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const [user] = useUser();
  const [loans] = useLoans();
  const [loading, setloading] = React.useState(true);
  setInterval(function () {
    setloading(false);
  }, loadingCount * 1000);
  if (user) {
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>
        <div className={classes.root}>
          <Typography variant="h5" noWrap>
            Loan List
          </Typography>
          {loans && !loans.message ? (
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No</StyledTableCell>
                    <StyledTableCell align="center">
                      Borrower Name
                    </StyledTableCell>
                    <StyledTableCell align="right">Loan Amount</StyledTableCell>
                    <StyledTableCell align="right">
                      Interest Rate
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Total Months
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Monthly Payment
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Link href={`/loan/${row._id}`} prefetch={false}>
                          <a className={classes.anchor}>
                            {row.borrowerInfo.borrower}
                          </a>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.loanAmount} Ks
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.interestRate}%
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.totalInstallmentMonths} Mths
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.monthlyPayment} Ks
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.tableContainer}> Loading..</div>
          )}
        </div>
      </Layout>
    );
  }
  return <>{loading ? <Loading></Loading> : <Welcome></Welcome>}</>;
};

export default Home;
