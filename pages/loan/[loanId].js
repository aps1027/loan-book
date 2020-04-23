import { useLoanToGetById } from "../../lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Head from "next/head";
import {
  makeStyles,
  Typography,
  Grid,
  Divider,
  Paper,
  withStyles,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  Checkbox,
} from "@material-ui/core";
import moment from "moment";

const themeColor = "#1976d2";
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
  spanColor: {
    color: themeColor,
    fontSize: "14px",
  },
  borrowerInfo: {
    width: "100%",
  },
  borrowerDivider: {
    margin: theme.spacing(1.5, 0),
  },
  borrowerHead: {
    width: "65px",
    display: "inline-block",
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  paperGroup: {
    flexGrow: 1,
  },
  valueBox: {
    width: "207px",
    padding: theme.spacing(0.5, 1),
  },
  valueStyle: {
    color: themeColor,
    fontSize: "14px",
    float: "right",
    paddingTop: "2px",
  },
  tableContainer: {
    width: "100%",
    display: "block",
    margin: theme.spacing(1, 0),
  },
  dateBox: {
    width: "170px",
    padding: theme.spacing(0.5, 1),
    float: "right",
  },
}));

const LoanIdPage = (props) => {
  const classes = useStyles();
  const router = useRouter();
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
  const [loan] = useLoanToGetById(props.loanUrl);
  const [modifiedDate, setModifiedDate] = React.useState(new Date());
  const [paidStatusObj, setPaidStatusObj] = React.useState({});
  const handleChange = async (event, id, date, isPaid) => {
    event.preventDefault();
    const res = await fetch(`/api/loan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: date, isPaid: isPaid }),
    });
    if (res.status === 200) {
      let tmpPaidStatusObj = paidStatusObj;
      tmpPaidStatusObj[date] = isPaid;
      setPaidStatusObj(tmpPaidStatusObj);
      setModifiedDate(new Date());
    }
  };
  useEffect(() => {
    if (loan && loan.message) router.replace("/");
    else if (loan) setModifiedDate(loan.date);
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
          <Grid className={classes.borrowerInfo}>
            <Typography variant="h4">{loan.borrowerInfo.borrower}</Typography>
            <Divider className={classes.borrowerDivider}></Divider>
            <Grid>
              <Typography>
                <span className={classes.borrowerHead}>NRC</span>
                <i className={classes.spanColor}>{loan.borrowerInfo.nrcNo}</i>
              </Typography>
              <Typography>
                <span className={classes.borrowerHead}>Phone</span>
                <i className={classes.spanColor}>{loan.borrowerInfo.phoneNo}</i>
              </Typography>
              <Typography>
                <span className={classes.borrowerHead}>Address</span>
                <i className={classes.spanColor}>{loan.borrowerInfo.address}</i>
              </Typography>
            </Grid>
            <Divider className={classes.borrowerDivider}></Divider>
            <Grid container spacing={1} className={classes.paperGroup}>
              <Grid item className={classes.valueBox}>
                <Typography>
                  <span>Loan Amount</span>
                  <i className={classes.valueStyle}>{loan.loanAmount} Ks</i>
                </Typography>
              </Grid>
              <Grid item className={classes.valueBox}>
                <Typography>
                  <span>Mhly Interest Rate</span>
                  <i className={classes.valueStyle}>{loan.interestRate} %</i>
                </Typography>
              </Grid>
              <Grid item className={classes.valueBox}>
                <Typography>
                  <span>Installment Months</span>
                  <i className={classes.valueStyle}>
                    {loan.totalInstallmentMonths} Mths
                  </i>
                </Typography>
              </Grid>
              <Grid item className={classes.valueBox}>
                <Typography>
                  <span>Mthly Payment</span>
                  <i className={classes.valueStyle}>{loan.monthlyPayment} Ks</i>
                </Typography>
              </Grid>
            </Grid>
            <Divider className={classes.borrowerDivider}></Divider>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No</StyledTableCell>
                    <StyledTableCell align="center">Due Date</StyledTableCell>
                    <StyledTableCell align="right">
                      Remaining Loan
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Monthly Payment
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Interest Amount
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Total Payment
                    </StyledTableCell>
                    <StyledTableCell align="center">Paid</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loan.installmentRecords.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.dueDate}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.remainingLoan}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.monthlyPayment}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.interestAmount}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.totalPayment}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={row.isPaid || paidStatusObj[row.dueDate]}
                          onChange={(e) =>
                            handleChange(e, loan._id, row.dueDate, !row.isPaid)
                          }
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item className={classes.dateBox}>
              <Typography>
                <span>Modified</span>
                <i className={classes.valueStyle}>
                  {moment(modifiedDate).format("DD/MM/YYYY")}
                </i>
              </Typography>
            </Grid>
          </Grid>
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
