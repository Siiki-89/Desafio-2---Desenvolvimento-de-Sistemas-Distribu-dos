export const PaymentStatus = {
  Pending: 'PENDING',
  Success: 'SUCCESS',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type PaymentRequestedEvent = {
  eventId: string;
  type: 'payment.requested';
  paymentId: string;
  customerEmail: string;
  amount: number;
  status: typeof PaymentStatus.Pending;
  occurredAt: string;
};

export type PaymentConfirmedEvent = {
  eventId: string;
  type: 'payment.confirmed';
  paymentId: string;
  customerEmail: string;
  amount: number;
  status: typeof PaymentStatus.Success;
  occurredAt: string;
};

export type PaymentEvent = PaymentRequestedEvent | PaymentConfirmedEvent;
