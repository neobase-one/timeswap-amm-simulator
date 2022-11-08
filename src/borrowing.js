export const borrowingFunction = (
  borrowingAmount,
  chosenInterestRate,
  daysLeft,
  X,
  Y,
  Z,
  K
) => {
  const secondsInDay = 86400;
  const dYear = 31556926; //no of seconds in a year

  const calculateYmax = (borrowingAmount, X, Y, Z) => {
    return K / (Z * (X - borrowingAmount)) - Y;
  };
  const calculateZmax = (borrowingAmount, X, Y, Z) => {
    return K / (Y * (X - borrowingAmount)) - Z;
  };

  const yMax = calculateYmax(borrowingAmount, X, Y, Z);
  const zMax = calculateZmax(borrowingAmount, X, Y, Z);

  const smallY = (borrowingAmount * (chosenInterestRate / 100)) / dYear;

  const debt = borrowingAmount + daysLeft * secondsInDay * smallY;

  const smallZ = K / ((X - borrowingAmount) * (Y + smallY)) - Z;

  const collateralToBeLocked =
    zMax + (smallZ * daysLeft * secondsInDay) / 2 ** 25;

  const newX = Number(X) - Number(borrowingAmount);
  const newY = Y + smallY;
  const newZ = Z + smallZ;
  const newK = newX * newY * newZ;
  const mode = "borrowing";
  const BPT = 0;
  const BIT = 0;
  const IPT = 0;
  const IIT = 0;
  const debtOwed = debt;
  const CDT = collateralToBeLocked;

  return {
    borrowingAmount,
    chosenInterestRate,
    newX,
    newY,
    newZ,
    newK,
    mode,
    BPT,
    BIT,
    IPT,
    IIT,
    debtOwed,
    CDT,
    daysLeft,
  };
};
