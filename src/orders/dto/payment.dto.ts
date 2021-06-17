export interface PaymentDto {
  amount: number;
  currency: string;
  payment_method_types: string;
  metadata: { user: string }
}
