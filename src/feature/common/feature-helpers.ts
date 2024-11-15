export const formatCurrency = (amount: number) =>
  (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
