import Layout from "../components/layout";
import {
  TextField,
  Typography,
  InputAdornment,
  makeStyles,
  Button,
  FormControl,
  FormHelperText,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  Table,
  TableBody,
} from "@material-ui/core";
import moment from "moment";
import clsx from "clsx";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import Head from "next/head";
import { useRouter } from "next/router";

const themeColor = "#1976d2";
const hoverColor = "#1976BE";
const errorList = {
  loanAmount: "Numeric Loan Amount is required.",
  interestRate: "Numeric Interest Rate is required.",
  totalInstallmentMonths: "Numeric monthly Installment Months is required.",
  firstInstallmentDate: "First Installment Date must be greatr than Today.",
};
const borrowerErrorList = {
  borrower: "Borrower name is required.",
  nrcNo: "NRC Number is requred.",
  phoneNo: "Phone Number is required.",
  address: "Address is required.",
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  calculator: {
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
  btnBox: {
    padding: theme.spacing(1),
    width: "100%",
  },
  btnBoxShift: {
    display: "none",
  },
  btn: {
    backgroundColor: themeColor,
    "&:hover": {
      backgroundColor: hoverColor,
      opacity: 0.5,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
  input: {
    width: "300px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  textarea: {
    width: "616px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  date: {
    width: "300px",
    margin: theme.spacing(0),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  row: {
    width: "100%",
    padding: theme.spacing(1, 0),
  },
  rowShift: {
    display: "none",
  },
  tableContainer: {
    width: "100%",
    display: "block",
    marginBottom: theme.spacing(2),
  },
  tableContainerShift: {
    display: "none",
  },
  borrowerInfo: {
    display: "block",
  },
  borrowerInfoShift: {
    display: "none",
  },
}));

export default function Calculator() {
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

  const [openBorrowerInfo, setOpenBorroweInfo] = React.useState(false);
  const [installmentRecords, setInstallmentRecords] = React.useState([]);
  const [loanValues, setLoanValues] = React.useState({
    loanAmount: 0,
    interestRate: 0,
    totalInstallmentMonths: 0,
    firstInstallmentDate: new Date(),
  });
  const [errors, setErrors] = React.useState({
    loanAmount: false,
    interestRate: false,
    totalInstallmentMonths: false,
    firstInstallmentDate: false,
  });
  const [borrowerErrors, setBorrowerErrors] = React.useState({
    borrower: false,
    nrcNo: false,
    phoneNo: false,
    address: false,
  });
  const [borrowerHelperTexts, setBorrowerHelperTexts] = React.useState({
    borrower: "",
    nrcNo: "",
    phoneNo: "",
    address: "",
  });
  const [values, setValues] = React.useState({});
  const [borrowerValues, setBorrowerValues] = React.useState({});
  const [helperTexts, setHelperTexts] = React.useState({
    loanAmount: "",
    interestRate: "",
    totalInstallmentMonths: "",
    firstInstallmentDate: "",
  });
  const [monthlyPayment, setmonthlyPayment] = React.useState(0);
  const [selectedInstallmentDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    if (date.toString() === "Invalid Date") {
      setErrors({
        ...errors,
        ["firstInstallmentDate"]: true,
      });
    } else {
      setErrors({
        ...errors,
        ["firstInstallmentDate"]: false,
      });
    }
    setSelectedDate(date);
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    if (event.target.value > 0) {
      setErrors({
        ...errors,
        [name]: false,
      });
      setHelperTexts({
        ...helperTexts,
        [name]: "",
      });
    } else {
      setErrors({
        ...errors,
        [name]: true,
      });
      setHelperTexts({
        ...helperTexts,
        [name]: errorList[name],
      });
    }
  };

  const handleBorrowerChange = (name) => (event) => {
    setBorrowerValues({ ...borrowerValues, [name]: event.target.value });
    if (event.target.value.trim() !== "") {
      setBorrowerErrors({
        ...borrowerErrors,
        [name]: false,
      });
      setBorrowerHelperTexts({
        ...borrowerHelperTexts,
        [name]: "",
      });
    } else {
      setBorrowerErrors({
        ...borrowerErrors,
        [name]: true,
      });
      setBorrowerHelperTexts({
        ...borrowerHelperTexts,
        [name]: borrowerErrorList[name],
      });
    }
  };

  const handleClick = () => {
    setOpenBorroweInfo(true);
  };

  function createData(
    dueDate,
    remainingLoan,
    interestAmount,
    monthlyPayment,
    totalPayment,
    isPaid
  ) {
    return {
      dueDate,
      remainingLoan,
      interestAmount,
      monthlyPayment,
      totalPayment,
      isPaid,
    };
  }

  async function handleSaveSubmit(event) {
    event.preventDefault();
    let tmpErrors = {
      borrower: false,
      nrcNo: false,
      phoneNo: false,
      address: false,
    };
    let tmpErrorMessages = {
      borrower: "",
      nrcNo: "",
      phoneNo: "",
      address: "",
    };

    if (!borrowerValues.borrower || borrowerValues.borrower.trim() === "") {
      tmpErrors.borrower = true;
      tmpErrorMessages.borrower = borrowerErrorList.borrower;
    } else {
      tmpErrors.borrower = false;
      tmpErrorMessages.borrower = "";
    }

    if (!borrowerValues.nrcNo || borrowerValues.nrcNo.trim() === "") {
      tmpErrors.nrcNo = true;
      tmpErrorMessages.nrcNo = borrowerErrorList.nrcNo;
    } else {
      tmpErrors.nrcNo = false;
      tmpErrorMessages.nrcNo = "";
    }

    if (!borrowerValues.phoneNo || borrowerValues.phoneNo.trim() === "") {
      tmpErrors.phoneNo = true;
      tmpErrorMessages.phoneNo = borrowerErrorList.phoneNo;
    } else {
      tmpErrors.phoneNo = false;
      tmpErrorMessages.phoneNo = "";
    }

    if (!borrowerValues.address || borrowerValues.address.trim() === "") {
      tmpErrors.address = true;
      tmpErrorMessages.address = borrowerErrorList.address;
    } else {
      tmpErrors.address = false;
      tmpErrorMessages.address = "";
    }

    setBorrowerErrors({
      ["borrower"]: tmpErrors.borrower,
      ["nrcNo"]: tmpErrors.nrcNo,
      ["phoneNo"]: tmpErrors.phoneNo,
      ["address"]: tmpErrors.address,
    });
    setBorrowerHelperTexts({
      ["borrower"]: tmpErrorMessages.borrower,
      ["nrcNo"]: tmpErrorMessages.nrcNo,
      ["phoneNo"]: tmpErrorMessages.phoneNo,
      ["address"]: tmpErrorMessages.address,
    });

    if (
      (!tmpErrors.borrower,
      !tmpErrors.nrcNo,
      !tmpErrors.phoneNo,
      !tmpErrors.address)
    ) {
      const body = {
        borrowerInfo: borrowerValues,
        loanAmount: loanValues.loanAmount,
        interestRate: loanValues.interestRate,
        totalInstallmentMonths: loanValues.totalInstallmentMonths,
        firstInstallmentDate: loanValues.firstInstallmentDate,
        monthlyPayment: monthlyPayment,
        installmentRecords: installmentRecords,
      };
      const res = await fetch("/api/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        router.replace("/");
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let tmpErrors = {
      loanAmount: false,
      interestRate: false,
      totalInstallmentMonths: false,
      firstInstallmentDate: false,
    };
    let tmpErrorMessages = {
      loanAmount: "",
      interestRate: "",
      totalInstallmentMonths: "",
      firstInstallmentDate: "",
    };
    const today = new Date();
    let todayDatOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    let selectedInstallmentDateOnly = new Date();
    if (selectedInstallmentDate) {
      selectedInstallmentDateOnly = new Date(
        selectedInstallmentDate.getFullYear(),
        selectedInstallmentDate.getMonth(),
        selectedInstallmentDate.getDate(),
        0,
        0,
        0
      );
    }
    if (selectedInstallmentDate.toString() === "Invalid Date") {
      tmpErrors.firstInstallmentDate = true;
    } else if (
      !selectedInstallmentDate ||
      selectedInstallmentDateOnly < todayDatOnly
    ) {
      tmpErrors.firstInstallmentDate = true;
      tmpErrorMessages.firstInstallmentDate = errorList.firstInstallmentDate;
    } else {
      tmpErrors.firstInstallmentDate = false;
      tmpErrorMessages.firstInstallmentDate = "";
    }

    if (!values.interestRate || values.interestRate < 0) {
      tmpErrors.interestRate = true;
      tmpErrorMessages.interestRate = errorList.interestRate;
    } else {
      tmpErrors.interestRate = false;
      tmpErrorMessages.interestRate = "";
    }

    if (!values.loanAmount || values.loanAmount < 0) {
      tmpErrors.loanAmount = true;
      tmpErrorMessages.loanAmount = errorList.loanAmount;
    } else {
      tmpErrors.loanAmount = false;
      tmpErrorMessages.loanAmount = "";
    }

    if (!values.totalInstallmentMonths || values.totalInstallmentMonths < 0) {
      tmpErrors.totalInstallmentMonths = true;
      tmpErrorMessages.totalInstallmentMonths =
        errorList.totalInstallmentMonths;
    } else {
      tmpErrors.totalInstallmentMonths = false;
      tmpErrorMessages.totalInstallmentMonths = "";
    }

    setErrors({
      ["loanAmount"]: tmpErrors.loanAmount,
      ["interestRate"]: tmpErrors.interestRate,
      ["totalInstallmentMonths"]: tmpErrors.totalInstallmentMonths,
      ["firstInstallmentDate"]: tmpErrors.firstInstallmentDate,
    });
    setHelperTexts({
      ["loanAmount"]: tmpErrorMessages.loanAmount,
      ["interestRate"]: tmpErrorMessages.interestRate,
      ["totalInstallmentMonths"]: tmpErrorMessages.totalInstallmentMonths,
      ["firstInstallmentDate"]: tmpErrorMessages.firstInstallmentDate,
    });

    if (
      (!tmpErrors.interestRate,
      !tmpErrors.totalInstallmentMonths,
      !tmpErrors.loanAmount,
      !tmpErrors.firstInstallmentDate)
    ) {
      setLoanValues({
        ["loanAmount"]: values.loanAmount,
        ["interestRate"]: values.interestRate,
        ["totalInstallmentMonths"]: values.totalInstallmentMonths,
        ["firstInstallmentDate"]: selectedInstallmentDate,
      });
      setmonthlyPayment(
        (values.loanAmount / values.totalInstallmentMonths).toFixed(0)
      );
      const tmpRecordList = new Array();
      for (
        let nPerMonth = 1;
        nPerMonth <= values.totalInstallmentMonths;
        nPerMonth++
      ) {
        const tmpMonthlyPayment =
          values.loanAmount / values.totalInstallmentMonths;
        const remainingLoan = values.loanAmount - tmpMonthlyPayment * nPerMonth;
        const insterestAmount =
          ((remainingLoan + tmpMonthlyPayment) * values.interestRate) / 100;
        const totalPayment = insterestAmount + tmpMonthlyPayment;
        const isPaid = false;
        const installmentObj = createData(
          moment(selectedInstallmentDate)
            .add(nPerMonth - 1, "months")
            .format("DD/MM/YYYY"),
          remainingLoan.toFixed(0),
          insterestAmount.toFixed(0),
          tmpMonthlyPayment.toFixed(0),
          totalPayment.toFixed(0),
          isPaid
        );
        tmpRecordList.push(installmentObj);
      }
      setInstallmentRecords(tmpRecordList);
    }
  }
  return (
    <Layout>
      <Head>
        <title>Calculator</title>
      </Head>
      <div className={classes.calculator}>
        <Typography variant="h5" noWrap>
          Loan Calculator
        </Typography>
        <form className={classes.root} onSubmit={handleSubmit}>
          <div className={classes.row}>
            <FormControl
              component="fieldset"
              error={errors.loanAmount}
              className={classes.formControl}
            >
              <TextField
                className={classes.input}
                label="Loan Amount"
                placeholder="Ex. 100000"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Ks</InputAdornment>
                  ),
                }}
                error={errors.loanAmount}
                onChange={handleChange("loanAmount")}
              />
              <FormHelperText>{helperTexts.loanAmount}</FormHelperText>
            </FormControl>

            <FormControl
              component="fieldset"
              error={errors.interestRate}
              className={classes.formControl}
            >
              <TextField
                className={classes.input}
                label="Interest Rate"
                placeholder="Ex. 10"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                error={errors.interestRate}
                onChange={handleChange("interestRate")}
              />
              <FormHelperText>{helperTexts.interestRate}</FormHelperText>
            </FormControl>
            <FormControl
              component="fieldset"
              error={errors.totalInstallmentMonths}
              className={classes.formControl}
            >
              <TextField
                className={classes.input}
                label="monthly Installment Months"
                placeholder="Ex. 20"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Mths</InputAdornment>
                  ),
                }}
                error={errors.totalInstallmentMonths}
                onChange={handleChange("totalInstallmentMonths")}
              />
              <FormHelperText>
                {helperTexts.totalInstallmentMonths}
              </FormHelperText>
            </FormControl>
            <FormControl
              className={classes.formControl}
              error={errors.firstInstallmentDate}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  className={classes.date}
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="First Installment Date"
                  value={selectedInstallmentDate}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  onChange={handleDateChange}
                  inputVariant="outlined"
                  error={errors.firstInstallmentDate}
                />
              </MuiPickersUtilsProvider>
              <FormHelperText>
                {helperTexts.firstInstallmentDate}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={classes.btnBox}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              className={classes.btn}
            >
              Calculate
            </Button>
          </div>
          <div
            className={clsx(classes.row, {
              [classes.rowShift]: !monthlyPayment,
            })}
          >
            <FormControl className={classes.formControl}>
              <TextField
                disabled
                className={classes.input}
                label="Monthly Payment"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Ks</InputAdornment>
                  ),
                }}
                value={monthlyPayment}
              />
            </FormControl>
          </div>
        </form>
        <TableContainer
          component={Paper}
          className={clsx(classes.tableContainer, {
            [classes.tableContainerShift]: !installmentRecords.length,
          })}
        >
          <Table aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell align="center">Due Date</StyledTableCell>
                <StyledTableCell align="right">Remaining Loan</StyledTableCell>
                <StyledTableCell align="right">Monthly Payment</StyledTableCell>
                <StyledTableCell align="right">Interest Amount</StyledTableCell>
                <StyledTableCell align="right">Total Payment</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {installmentRecords.map((row, index) => (
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          className={clsx(classes.btnBox, {
            [classes.btnBoxShift]: !installmentRecords.length,
          })}
        >
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={handleClick}
          >
            To Save Loan
          </Button>
        </div>
        <form
          onSubmit={handleSaveSubmit}
          className={clsx(classes.borrowerInfo, {
            [classes.borrowerInfoShift]: !openBorrowerInfo,
          })}
        >
          <div className={classes.row}>
            <FormControl
              component="fieldset"
              className={classes.formControl}
              error={borrowerErrors.borrower}
            >
              <TextField
                className={classes.input}
                label="Borrower"
                placeholder="Ex. AungPyaeSone"
                variant="outlined"
                type="text"
                error={borrowerErrors.borrower}
                onChange={handleBorrowerChange("borrower")}
              />
              <FormHelperText>{borrowerHelperTexts.borrower}</FormHelperText>
            </FormControl>

            <FormControl
              component="fieldset"
              className={classes.formControl}
              error={borrowerErrors.nrcNo}
            >
              <TextField
                className={classes.input}
                label="NRC Number"
                placeholder="Ex. 12/MaGaDa(C)123456"
                variant="outlined"
                type="text"
                error={borrowerErrors.nrcNo}
                onChange={handleBorrowerChange("nrcNo")}
              />
              <FormHelperText>{borrowerHelperTexts.nrcNo}</FormHelperText>
            </FormControl>
            <FormControl
              component="fieldset"
              className={classes.formControl}
              error={borrowerErrors.phoneNo}
            >
              <TextField
                className={classes.input}
                label="Phone Number"
                placeholder="Ex. 09254138466"
                variant="outlined"
                type="text"
                error={borrowerErrors.phoneNo}
                onChange={handleBorrowerChange("phoneNo")}
              />
              <FormHelperText>{borrowerHelperTexts.phoneNo}</FormHelperText>
            </FormControl>
            <FormControl
              component="fieldset"
              className={classes.formControl}
              error={borrowerErrors.address}
            >
              <TextField
                className={classes.textarea}
                label="Address"
                placeholder="Tawya (6) street, Htauk Kyant, Yangon"
                multiline
                rows={3}
                variant="outlined"
                error={borrowerErrors.address}
                onChange={handleBorrowerChange("address")}
              />
              <FormHelperText>{borrowerHelperTexts.address}</FormHelperText>
            </FormControl>
          </div>
          <div className={classes.btnBox}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              className={classes.btn}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
