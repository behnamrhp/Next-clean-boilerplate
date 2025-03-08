import { z } from "zod";

export const invoiceSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
});

export type InvoiceParam = z.infer<typeof invoiceSchema>;
