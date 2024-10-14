interface IDataPayment {
  ccy: number;
  amount: number;
  status: string;
  invoiceId: string;
  payMethod: string;
  createdDate: string;
  finalAmount: number;
  paymentInfo: {
    fee: number;
    rrn: string;
    bank: string;
    tranId: string;
    country: string;
    terminal: string;
    maskedPan: string;
    approvalCode: string;
    paymentMethod: string;
    paymentSystem: string;
  };
  modifiedDate: string;
}

export interface IWallet {
  id: number;
  account_id: number;
  invoice_id: string;
  status: string;
  amount: number;
  createdAt: number;
  data_payment: IDataPayment | null;
  url_page: string;
}
