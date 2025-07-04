import React from 'react';

const PrintInvoice = () => {
  return (
    <div className="invoice-print">
      <div className="business-header">
        <div className="business-name">Antara's</div>
        <div className="business-desc">HAIR STUDIO AND BEAUTY SALON</div>
        <div className="business-address">
          1st Floor of MAX Fashion Building, Bagmore<br />
          Kanchrapara GP Tower<br />
          9123085454 / (033) 35912524
        </div>
      </div>
      <div className="invoice-details">
        <div>CUST: <b>ISHIKA DEY</b></div>
        <div>TEL/EMAIL: <b>9875574185</b></div>
        <div>BILL NO: <b>A0911/25-26</b></div>
        <div>DATE: <b>30/06/2025</b></div>
        <div>TIME: <b>08:49:35</b></div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Particulars</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>DANDRUFF Treatment</td>
            <td>1</td>
            <td>1200.00</td>
            <td>1200.00</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Hair Smoothening</td>
            <td>1</td>
            <td>3000.00</td>
            <td>3000.00</td>
          </tr>
        </tbody>
      </table>
      <div className="totals">
        <div>Total: <b>INR 4200</b></div>
        <div>Payable Amt: <b>INR 4200</b></div>
        <div>Payment Mode: <b>PHONEPAY</b></div>
        <div>IN WORDS: FOUR THOUSAND TWO HUNDRED ONLY</div>
      </div>
      <div className="footer">THANK YOU HAVE A NICE DAY!</div>
      <button className="print-btn" onClick={() => window.print()}>Print</button>
      <style>{`
        .invoice-print {
          width: 2in;
          font-size: 11px;
          font-family: 'Arial', sans-serif;
          color: #000;
          margin: 0 auto;
          padding: 0;
        }
        .business-header {
          text-align: center;
          margin-bottom: 4px;
        }
        .business-name {
          font-size: 16px;
          font-weight: bold;
        }
        .business-desc {
          font-size: 10px;
          margin-bottom: 2px;
        }
        .business-address {
          font-size: 9px;
          margin-bottom: 4px;
        }
        .invoice-details, .totals {
          margin-bottom: 4px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 4px;
        }
        .invoice-table th, .invoice-table td {
          border-bottom: 1px solid #ccc;
          padding: 2px 0;
          text-align: left;
          font-size: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 6px;
          font-size: 10px;
        }
        .print-btn {
          display: block;
          margin: 8px auto 0 auto;
          padding: 4px 12px;
          font-size: 11px;
        }
        @media print {
          body * { visibility: hidden; }
          .invoice-print, .invoice-print * { visibility: visible; }
          .invoice-print { position: absolute; left: 0; top: 0; }
          .print-btn { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PrintInvoice; 