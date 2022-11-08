import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { lendingFunction } from "./lending";
import { borrowingFunction } from "./borrowing";

const App = () => {
  const initialDeposit = 10000;
  const liquidityInterestPercentage = 15;
  const cdpPercentage = 167;
  const ethPrice = 4000;
  const initialDaysLeft = 365;

  const secondsInYear = 31556926;

  const initialYValue =
    (initialDeposit * (liquidityInterestPercentage / 100)) / secondsInYear;
  const initialZValue = (initialDeposit * (cdpPercentage / 100)) / ethPrice;

  const initialKValue = initialDeposit * initialYValue * initialZValue;

  const defaultTransaction = {
    amount: initialDeposit,
    chosenInterest: liquidityInterestPercentage,
    X: initialDeposit,
    Y: initialYValue,
    Z: initialZValue,
    K: initialKValue,
    mode: "null",
    BPT: 0,
    BIT: 0,
    IPT: 0,
    IIT: 0,
    debtOwed: 0,
    CDT: 0,
    daysLeft: initialDaysLeft,
  };

  const [transactionArray, setTransactionArray] = useState([
    defaultTransaction,
  ]);

  const [xyzParameters, setXyzParameters] = useState({
    xValue: initialDeposit,
    yValue: initialYValue,
    zValue: initialZValue,
    kValue: initialKValue,
    mode: "null",
  });

  const handleLendFormDisplay = () => {
    setXyzParameters((prevState) => {
      return {
        ...prevState,
        mode: "lending",
      };
    });
  };

  const handleBorrowFormDisplay = () => {
    setXyzParameters((prevState) => {
      return {
        ...prevState,
        mode: "borrowing",
      };
    });
  };

  const [formDetails, setFormDetails] = useState({
    enteredAmount: 0,
    enteredInterest: 0,
    daysLeft: 0,
  });

  const handleFormSubmit = () => {
    const lendingTransaction = lendingFunction(
      Number(formDetails.enteredAmount),
      Number(formDetails.enteredInterest),
      Number(formDetails.daysLeft),
      xyzParameters.xValue,
      xyzParameters.yValue,
      xyzParameters.zValue,
      xyzParameters.kValue
    );
    const borrowingTransaction = borrowingFunction(
      Number(formDetails.enteredAmount),
      Number(formDetails.enteredInterest),
      Number(formDetails.daysLeft),
      xyzParameters.xValue,
      xyzParameters.yValue,
      xyzParameters.zValue,
      xyzParameters.kValue
    );

    if (xyzParameters.mode === "lending") {
      setTransactionArray((prevState) => {
        return [
          ...prevState,
          {
            amount: lendingTransaction.lendingAmount,
            chosenInterest: lendingTransaction.chosenInterestRate,
            X: lendingTransaction.newX,
            Y: lendingTransaction.newY,
            Z: lendingTransaction.newZ,
            K: lendingTransaction.newK,
            mode: lendingTransaction.mode,
            BPT: lendingTransaction.BPT,
            BIT: lendingTransaction.BIT,
            IPT: lendingTransaction.IPT,
            IIT: lendingTransaction.IIT,
            debtOwed: lendingTransaction.debtOwed,
            CDT: lendingTransaction.CDT * ethPrice,
            daysLeft: lendingTransaction.daysLeft,
          },
        ];
      });
    } else if (xyzParameters.mode === "borrowing") {
      setTransactionArray((prevState) => {
        return [
          ...prevState,
          {
            amount: borrowingTransaction.borrowingAmount,
            chosenInterest: borrowingTransaction.chosenInterestRate,
            X: borrowingTransaction.newX,
            Y: borrowingTransaction.newY,
            Z: borrowingTransaction.newZ,
            K: borrowingTransaction.newK,
            mode: borrowingTransaction.mode,
            BPT: borrowingTransaction.BPT,
            BIT: borrowingTransaction.BIT,
            IPT: borrowingTransaction.IPT,
            IIT: borrowingTransaction.IIT,
            debtOwed: borrowingTransaction.debtOwed,
            CDT: borrowingTransaction.CDT * ethPrice,
            daysLeft: borrowingTransaction.daysLeft,
          },
        ];
      });
    }
  };

  const handleAmountChanges = (e) => {
    setFormDetails((prevState) => {
      return { ...prevState, enteredAmount: e.target.value };
    });
  };
  const handleInterestChanges = (e) => {
    setFormDetails((prevState) => {
      return { ...prevState, enteredInterest: e.target.value };
    });
  };
  const handleDaysLeftChanges = (e) => {
    setFormDetails((prevState) => {
      return { ...prevState, daysLeft: e.target.value };
    });
  };

  const renderTransactionArray = () => {
    return transactionArray.map((transaction, index) => {
      return (
        <div className="table-row hover:bg-black hover:text-white">
          <div className="table-cell">{index}</div>
          <div className="table-cell">{transaction.amount}</div>
          <div className="table-cell">{transaction.chosenInterest}</div>
          <div className="table-cell">{transaction.X}</div>
          <div className="table-cell">{transaction.Y.toFixed(6)}</div>
          <div className="table-cell">{transaction.Z.toFixed(6)}</div>
          <div className="table-cell">{transaction.K.toFixed(6)}</div>
          <div className="table-cell">{transaction.mode}</div>
          <div className="table-cell">{transaction.BPT.toFixed(6)}</div>
          <div className="table-cell">{transaction.BIT.toFixed(6)}</div>
          <div className="table-cell">{transaction.IPT.toFixed(6)}</div>
          <div className="table-cell">{transaction.IIT.toFixed(6)}</div>
          <div className="table-cell">{transaction.debtOwed.toFixed(6)}</div>
          <div className="table-cell">{transaction.CDT.toFixed(6)}</div>
          <div className="table-cell">{transaction.daysLeft}</div>
        </div>
      );
    });
  };

  const calculateYmax = (enteredAmount, X, Y, Z, K) => {
    if (xyzParameters.mode === "lending") {
      return Y - K / (Z * (X + enteredAmount));
    } else if (xyzParameters.mode === "borrowing") {
      return K / (Z * (X - enteredAmount)) - Y;
    }
  };

  const yMax = calculateYmax(
    Number(formDetails.enteredAmount),
    Number(xyzParameters.xValue),
    Number(xyzParameters.yValue),
    Number(xyzParameters.zValue),
    Number(xyzParameters.kValue)
  );

  const calculateMinInterestRate = (yMax, enteredAmount) => {
    return (yMax * secondsInYear) / (16 * enteredAmount);
  };
  const minInterestRate = calculateMinInterestRate(
    yMax,
    formDetails.enteredAmount
  );

  const calculateMaxInterestRate = (yMax, enteredAmount) => {
    return (yMax * secondsInYear) / enteredAmount;
  };

  const maxInterestRate = calculateMaxInterestRate(
    yMax,
    formDetails.enteredAmount
  );

  useEffect(() => {
    setXyzParameters((prevState) => {
      return {
        ...prevState,
        xValue: transactionArray[transactionArray.length - 1].X,
        yValue: transactionArray[transactionArray.length - 1].Y,
        zValue: transactionArray[transactionArray.length - 1].Z,
        kValue: transactionArray[transactionArray.length - 1].K,
        mode: "null",
      };
    });
  }, [transactionArray]);

  return (
    <>
      <h1 className="ml-20 mt-5 font-black text-2xl">ETH-DAI Pool</h1>
      <div className="ml-20 mt-5">
        <div>{"Intial Deposit : " + initialDeposit + " DAI"}</div>
        <div>{"Expected Interest : " + liquidityInterestPercentage + "%"}</div>
        <div>{"Days Left : " + initialDaysLeft}</div>
        <div>{"EthPrice : " + ethPrice + " USD"}</div>
        <div>{"CDP Percentage : " + cdpPercentage + "%"}</div>
        <br />
        <div>{"intitial X Value : " + initialDeposit}</div>
        <div>{"intitial Y Value : " + initialYValue.toFixed(6)}</div>
        <div>{"intitial Z Value : " + initialZValue.toFixed(6)}</div>
        <div>{"intitial K Value : " + initialKValue.toFixed(6)}</div>
      </div>
      <br />
      <br />
      <br />

      <div className="table w-full ml-4">
        <div className="table-header-group font-bold">
          <div className="table-row">
            <div className="table-cell">##</div>
            <div className="table-cell">Amount</div>
            <div className="table-cell">Interest(%)</div>
            <div className="table-cell">X</div>
            <div className="table-cell">Y</div>
            <div className="table-cell">Z</div>
            <div className="table-cell">K</div>
            <div className="table-cell">MODE</div>
            <div className="table-cell">BPT</div>
            <div className="table-cell">BIT</div>
            <div className="table-cell">IPT</div>
            <div className="table-cell">IIT</div>
            <div className="table-cell">DEBT_OWED</div>
            <div className="table-cell">CDT(In USD)</div>
            <div className="table-cell">Days-Left</div>
          </div>
        </div>
        <div className="table-row-group">{renderTransactionArray()}</div>
        <br />
        <br />
        <br />
        <br />
      </div>

      <div className="ml-20">
        <Stack spacing={2} direction="row">
          <Button
            size="large"
            variant="outlined"
            onClick={handleLendFormDisplay}
          >
            Lend
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={handleBorrowFormDisplay}
          >
            Borrow
          </Button>
        </Stack>
        <br />
        {xyzParameters.mode === "lending" && (
          <>
            <p className="text-sky-400">Lending Mode</p>
            <p className="text-red-600 font-thin">{`Enter Interest Value: ${(
              minInterestRate * 100
            ).toFixed(2)}% to ${(maxInterestRate * 100).toFixed(2)}%`}</p>
          </>
        )}
        {xyzParameters.mode === "borrowing" && (
          <>
            <p className="text-sky-400">Borrowing Mode</p>
            <p className="text-red-600 font-thin">{`Enter Interest Value: ${(
              minInterestRate * 100
            ).toFixed(2)}% to ${(maxInterestRate * 100).toFixed(2)}%`}</p>
          </>
        )}
        <br />
        {(xyzParameters.mode === "lending" ||
          xyzParameters.mode === "borrowing") && (
          <>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="amount"
                type="number"
                label="Amount"
                variant="outlined"
                onChange={handleAmountChanges}
                value={formDetails.enteredAmount}
              />
              <TextField
                id="interest"
                type="number"
                label="Interest"
                variant="outlined"
                onChange={handleInterestChanges}
                value={formDetails.enteredInterest}
              />
              <TextField
                id="daysLeft"
                type="number"
                label="Days Left"
                variant="outlined"
                onChange={handleDaysLeftChanges}
                value={formDetails.daysLeft}
              />
            </Box>
            <Button variant="contained" onClick={handleFormSubmit}>
              Submit
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default App;
