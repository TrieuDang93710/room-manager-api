/* eslint-disable prettier/prettier */

export enum PaymentType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export enum PaymentMethod {
  CASH_PAYMENT = 'cash payment',
  CARD_PAYMENT = 'card payment',
}

export enum PaymentStatus {
  SUCCEED = 'succeeded',
  NOT_SUCCEED = 'not succeeded',
  REMOVED = 'removed',
}
