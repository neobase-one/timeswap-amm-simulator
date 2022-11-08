export const lendingFunction = (
  lendingAmount,
  chosenInterestRate,
  daysLeft,
  X,
  Y,
  Z,
  K
) => {
  const secondsInDay = 86400;
  const dYear = 31556926; //no of seconds in a year

  const calculateZmax = (lendingAmount, X, Y, Z) => {
    return Z - K / (Y * (X + lendingAmount));
  };

  const Y2 = (chosenInterestRate / 100) * (lendingAmount / dYear);

  const Z2 = Z - K / ((X + lendingAmount) * (Y - Y2));
  const zMax = calculateZmax(lendingAmount, X, Y, Z);

  const bondPrincipalTokens = lendingAmount;
  const bondInterestTokens = daysLeft * secondsInDay * Y2;
  const insurancePrincipalTokens = zMax;
  const insuranceInterestTokens = (Z2 * daysLeft * secondsInDay) / 2 ** 25;

  const newX = Number(X) + Number(lendingAmount);
  const newY = Y - Y2;
  const newZ = Z - Z2;
  const newK = newX * newY * newZ;
  const mode = "lending";
  const BPT = Number(bondPrincipalTokens);
  const BIT = bondInterestTokens;
  const IPT = insurancePrincipalTokens;
  const IIT = insuranceInterestTokens;
  const debtOwed = 0;
  const CDT = 0;

  return {
    lendingAmount,
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
