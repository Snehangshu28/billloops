import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import { useBusiness } from "../../context/BusinessContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
} from "firebase/firestore";
import Autocomplete from "@mui/material/Autocomplete";

const initialService = { description: "", rate: "", quantity: "" };
const initialProduct = { description: "", stock: "", rate: "", quantity: "" };
const initialClient = {
  name: "",
  address: "",
  contact: "",
  invoice: "",
  date: "",
  paymentMode: "",
};

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    preview: (
      <Box
        sx={{
          p: 2,
          border: "1px solid #1976d2",
          borderRadius: 2,
          background: "#f5f6fa",
          minWidth: 200,
        }}
      >
        <Typography variant="h6" color="primary">
          Modern
        </Typography>
        <Typography variant="body2">
          Blue header, clean lines, bold totals.
        </Typography>
      </Box>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    preview: (
      <Box
        sx={{
          p: 2,
          border: "1px solid #888",
          borderRadius: 2,
          background: "#fff",
          minWidth: 200,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Classic
        </Typography>
        <Typography variant="body2">
          Simple, black & white, traditional layout.
        </Typography>
      </Box>
    ),
  },
  // Add more templates as needed
];

const Bill = () => {
  const { data, updateBill } = useBusiness();
 const today = new Date().toISOString().split('T')[0]; // ✅ Format: YYYY-MM-DD

const initialClient = {
  name: "",
  address: "",
};
  const [bill, setBill] = useState({
     client: { ...initialClient, date: today },
    services: [{ ...initialService }],
    products: [{ ...initialProduct }],
    discount: "",
    footer: "",
    business: { bank: "", account: "" },
  });
  const printRef = useRef();
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Try to load from localStorage or default to 'modern'
    return localStorage.getItem("billTemplate") || "modern";
  });
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;
  const [records, setRecords] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [suggestedAddress, setSuggestedAddress] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedServices, setSuggestedServices] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [footerNote, setFooterNote] = useState("Thank you for your business!");
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const billData = location.state?.billData || null;

  // Use onboarding business info for invoice header
  // const businessInfo = data.onboarding.businessInfo || {};
  const employees = data.employees || [];

  // Add CGST and SGST state
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);

  // Add payment mode options
  const paymentModes = [
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
    { value: "UPI", label: "UPI" },
  ];

  // Remove this useEffect to prevent bill state from being overwritten after reset
  useEffect(() => {
    setBill((prev) => ({
      ...data.bill,
      products: data.bill.products || [initialProduct],
    }));
  }, [data.bill]);

  // Fetch stocks for dropdown
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
  });

  useEffect(() => {
    async function fetchBusinessInfo() {
      if (!currentUser?.uid) return;
      const docRef = doc(db, "businessUsers", currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setBusinessInfo(snap.data());
      }
    }
    fetchBusinessInfo();
  }, [currentUser]);

  useEffect(() => {
    if (!tenantId) return;
    const unsub = onSnapshot(
      collection(db, "tenants", tenantId, "stocks"),
      (snapshot) => {
        setStockList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
    return () => unsub();
  }, [tenantId]);

  // Fetch employees for dropdown
  useEffect(() => {
    if (!tenantId) return;
    const unsub = onSnapshot(
      collection(db, "tenants", tenantId, "employees"),
      (snapshot) => {
        setEmployeeList(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
    return () => unsub();
  }, [tenantId]);

  useEffect(() => {
    if (isEditing && billData) {
      setBill({
        client: { ...billData.client },
        services:
          billData.services?.length > 0
            ? billData.services
            : [{ ...initialService }],
        products:
          billData.products?.length > 0
            ? billData.products
            : [{ ...initialProduct }],
        discount: billData.discount || "",
        footer: billData.footer || "",
        business: billData.business || { bank: "", account: "" },
      });
    }
  }, [isEditing, billData]);

  // Save template selection to localStorage
  useEffect(() => {
    localStorage.setItem("billTemplate", selectedTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    if (!tenantId) return;
    const unsub = onSnapshot(
      collection(db, "tenants", tenantId, "bills"),
      (snapshot) => {
        setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsub();
  }, [tenantId]);

  // Handlers
  const handleClientContactAutofill = async (phone) => {
    if (!tenantId || !phone) return;
    // Query the most recent bill with this phone number
    const billsRef = collection(db, "tenants", tenantId, "bills");
    const q = query(
      billsRef,
      where("client.contact", "==", phone),
      orderBy("client.date", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const lastBill = snap.docs[0].data();
      setBill((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          name: lastBill.client.name || "",
          address: lastBill.client.address || "",
          contact: phone,
          invoice: prev.client.invoice,
          date: prev.client.date,
        },
      }));
    }
  };
  const handleClientChange = (e) => {
    setBill((prev) => {
      const updated = {
        ...prev,
        client: { ...prev.client, [e.target.name]: e.target.value },
      };
      return updated;
    });
    // Smart autofill on phone number change
    if (e.target.name === "contact") {
      const phone = e.target.value.trim();
      if (phone.length >= 6) {
        // Only search for reasonable phone numbers
        handleClientContactAutofill(phone);
      }
    }
  };
  const handleServiceChange = (idx, field, value) => {
    setBill((prev) => {
      const updatedServices = prev.services.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      );
      const updated = { ...prev, services: updatedServices };
      return updated;
    });
  };
  const handleAddService = () => {
    setBill((prev) => {
      const updated = {
        ...prev,
        services: [...prev.services, { ...initialService }],
      };
      return updated;
    });
  };
  const handleRemoveService = (idx) => {
    setBill((prev) => {
      const updated = {
        ...prev,
        services: prev.services.filter((_, i) => i !== idx),
      };
      return updated;
    });
  };
  const handleDiscountChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, discount: e.target.value };
      return updated;
    });
  };
  const handleFooterChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, footer: e.target.value };
      return updated;
    });
  };
  const handleBankChange = (e) => {
    setBill((prev) => {
      const updated = {
        ...prev,
        business: { ...prev.business, [e.target.name]: e.target.value },
      };
      return updated;
    });
  };

  // Product Handlers
  const handleProductChange = (idx, field, value) => {
    setBill((prev) => {
      let updatedProducts = prev.products.map((row, i) => {
        if (i === idx) {
          if (field === "stock") {
            // Auto-fill rate when stock is selected
            const selectedStock = stockList.find((s) => s.name === value);
            return {
              ...row,
              stock: value,
              rate:
                selectedStock && selectedStock.price ? selectedStock.price : "",
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      });
      const updated = { ...prev, products: updatedProducts };
      return updated;
    });
  };
  const handleAddProduct = () => {
    setBill((prev) => {
      const updated = {
        ...prev,
        products: [...prev.products, { ...initialProduct }],
      };
      return updated;
    });
  };
  const handleRemoveProduct = (idx) => {
    setBill((prev) => {
      const updated = {
        ...prev,
        products: prev.products.filter((_, i) => i !== idx),
      };
      return updated;
    });
  };

  // Calculate subtotal for a row
  const calcSubtotal = (row) => {
    const rate = parseFloat(row.rate) || 0;
    const qty = parseFloat(row.quantity) || 0;
    return rate * qty;
  };
  // Calculate subtotal for products
  const productSubtotal = (bill.products || []).reduce(
    (sum, row) => sum + calcSubtotal(row),
    0
  );
  // Calculate total and discount
  const subtotal =
    (bill.services || []).reduce((sum, row) => sum + calcSubtotal(row), 0) +
    productSubtotal;
  const discountPercent = parseFloat(bill.discount) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const cgstAmount = (subtotal * (parseFloat(cgst) || 0)) / 100;
  const sgstAmount = (subtotal * (parseFloat(sgst) || 0)) / 100;
  const total = subtotal - discountAmount + cgstAmount + sgstAmount;

  // Print handler with template selection
  const handlePrint = () => {
    const employeeName = "";
    let invoiceHtml = "";
    let style = "";
    if (selectedTemplate === "modern") {
      invoiceHtml = `
        <div class=\"invoice-header\">
          <div class=\"app-title\">BILLUS</div>
          <div class=\"invoice-title\">INVOICE</div>
          <div class=\"business-details\">
            <span><b>${businessName}</b></span>
            <span>${businessAddress}</span>
            <span>Email: ${businessEmail}</span>
            <span>Phone: ${businessPhone}</span>
          </div>
        </div>
        <div class=\"client-details\">
          <span class=\"section-title\">Bill To</span>
          <span><b>${bill.client.name || "Client Name"}</b></span>
          <span>${bill.client.address}</span>
          <span>Contact: ${bill.client.contact || ""}</span>
          <span>Invoice #: ${bill.client.invoice}</span>
          <span>Date: ${bill.client.date}</span>
          <span>Payment Mode: ${bill.client.paymentMode || ""}</span>
        </div>
        <div class=\"section-title\">Services</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Staff</th>
              <th>Rate (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${(bill.services || [])
              .map(
                (row) => `
              <tr>
                <td>${row.description}</td>
                <td>${row.staff || ""}</td>
                <td>${row.rate}</td>
                <td>${row.quantity}</td>
                <td>${calcSubtotal(row)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        ${
          bill.products &&
          bill.products.length > 0 &&
          bill.products.some(
            (p) => p.description || p.stock || p.rate || p.quantity
          )
            ? `
        <div class=\"section-title\">Products</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Stock</th>
              <th>Rate (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${(bill.products || [])
              .map(
                (row) => `
              <tr>
                <td>${row.description}</td>
                <td>${row.stock || ""}</td>
                <td>${row.rate}</td>
                <td>${row.quantity}</td>
                <td>${calcSubtotal(row)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        `
            : ""
        }
        <div class=\"summary\" style=\"text-align:right;\">
          <div><span class=\"label\">Subtotal:</span><span class=\"value\">₹ ${subtotal.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}</span></div>
          <div><span class=\"label\">Discount (${discountPercent}%):</span><span class=\"value\">- ₹ ${discountAmount.toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )}</span></div>
          <div><span class=\"label\">CGST (${cgst}%):</span><span class=\"value\">+ ₹ ${cgstAmount.toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )}</span></div>
          <div><span class=\"label\">SGST (${sgst}%):</span><span class=\"value\">+ ₹ ${sgstAmount.toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )}</span></div>
          <div style=\"margin-top:12px; font-size:1.3rem; font-weight:700; color:#1976d2; border-top:2px solid #1976d2; padding-top:8px;\"><span class=\"label\">Total:</span><span class=\"value\" style=\"margin-left:16px;\">₹ ${total.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}</span></div>
        </div>        
        <div class=\"footer-note\">${bill.footer}</div>
      `;
      style = `
        body { font-family: Roboto, Arial, sans-serif; background: #f5f6fa; margin: 0; }
        .invoice-container { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 40px 32px; }
        .app-title { font-size: 2.4rem; font-weight: 900; color: #1976d2; letter-spacing: 2px; text-align: center; margin-bottom: 8px; }
        .invoice-header { border-bottom: 2px solid #1976d2; padding-bottom: 16px; margin-bottom: 32px; }
        .invoice-title { font-size: 2.2rem; font-weight: 700; color: #1976d2; letter-spacing: 1px; text-align: center; }
        .business-details, .client-details { margin-bottom: 16px; }
        .business-details span, .client-details span { display: block; font-size: 1rem; color: #333; }
        .section-title { font-size: 1.1rem; font-weight: 600; color: #1976d2; margin-bottom: 8px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e0e0e0; padding: 10px 8px; text-align: left; }
        th { background: #f5f6fa; color: #1976d2; font-weight: 600; }
        .total-row td { font-size: 1.1rem; font-weight: 700; color: #1976d2; border-top: 2px solid #1976d2; }
        .summary { margin-top: 24px; text-align: right; }
        .summary .label { font-weight: 500; color: #555; }
        .summary .value { font-size: 1.2rem; font-weight: 700; color: #1976d2; margin-left: 16px; }
        .footer-note { margin-top: 32px; font-size: 1rem; color: #666; border-top: 1px dashed #bdbdbd; padding-top: 16px; }
        @media print { body { background: #fff; } .invoice-container { box-shadow: none; margin: 0; } }
      `;
    } else if (selectedTemplate === "classic") {
      invoiceHtml = `
        <div style=\"border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:24px;\">
          <h2 style=\"margin:0;\">INVOICE</h2>
          <div><b>${businessName}</b></div>
          <div>${businessAddress}</div>
          <div>Email: ${businessEmail}</div>
          <div>Phone: ${businessPhone}</div>
        </div>
        <div style=\"margin-bottom:16px;\">
          <b>Bill To:</b> ${bill.client.name || "Client Name"}<br/>
          ${bill.client.address}<br/>
          Contact: ${bill.client.contact || ""}<br/>
          Invoice #: ${bill.client.invoice}<br/>
          Date: ${bill.client.date}<br/>
          Payment Mode: ${bill.client.paymentMode || ""}
        </div>
        <table style=\"width:100%;border-collapse:collapse;margin-bottom:16px;\">
          <thead>
            <tr>
              <th style=\"border:1px solid #000;padding:6px;\">Description</th>
              <th style=\"border:1px solid #000;padding:6px;\">Staff</th>
              <th style=\"border:1px solid #000;padding:6px;\">Rate (₹)</th>
              <th style=\"border:1px solid #000;padding:6px;\">Quantity</th>
              <th style=\"border:1px solid #000;padding:6px;\">Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${(bill.services || [])
              .map(
                (row) => `
              <tr>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.description
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.staff || ""
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.rate
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.quantity
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${calcSubtotal(
                  row
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        ${
          bill.products &&
          bill.products.length > 0 &&
          bill.products.some(
            (p) => p.description || p.stock || p.rate || p.quantity
          )
            ? `
        <table style=\"width:100%;border-collapse:collapse;margin-bottom:16px;\">
          <thead>
            <tr>
              <th style=\"border:1px solid #000;padding:6px;\">Description</th>
              <th style=\"border:1px solid #000;padding:6px;\">Stock</th>
              <th style=\"border:1px solid #000;padding:6px;\">Rate (₹)</th>
              <th style=\"border:1px solid #000;padding:6px;\">Quantity</th>
              <th style=\"border:1px solid #000;padding:6px;\">Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${(bill.products || [])
              .map(
                (row) => `
              <tr>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.description
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.stock || ""
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.rate
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${
                  row.quantity
                }</td>
                <td style=\"border:1px solid #000;padding:6px;\">${calcSubtotal(
                  row
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        `
            : ""
        }
        <div style=\"text-align:right;\">
          <div>Subtotal: ₹ ${subtotal.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}</div>
          <div>Discount (${discountPercent}%): - ₹ ${discountAmount.toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )}</div>
          <div>CGST (${cgst}%): + ₹ ${cgstAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}</div>
          <div>SGST (${sgst}%): + ₹ ${sgstAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}</div>
          <div style=\"margin-top:12px; font-size:1.2rem; font-weight:700; color:#1976d2; border-top:2px solid #000; padding-top:8px;\"><b>Total: ₹ ${total.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}</b></div>
        </div>
       
        <div style=\"margin-top:24px;font-size:0.95rem;color:#444;\">${
          bill.footer
        }</div>
      `;
      style = `
        body { font-family: Arial, sans-serif; background: #fff; margin: 0; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 6px; }
        h2 { color: #000; }
      `;
    }
    const win = window.open("", "", "height=900,width=900");
    win.document.write("<html><head><title>Invoice</title>");
    win.document.write(
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" />'
    );
    win.document.write(`<style>${style}</style>`);
    win.document.write("</head><body>");
    win.document.write(`<div class=\"invoice-container\">${invoiceHtml}</div>`);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // Save Invoice handler
  const handleSaveInvoice = async () => {
    try {
      if (!tenantId) return;

      const normalizedPhone = normalizePhone(phone);
      const billToSave = {
        ...bill,
        client: {
          ...bill.client,
          name,
          address,
          contact: normalizedPhone,
        },
        total,
        cgst,
        sgst,
        subtotal,
        discountAmount,
        cgstAmount,
        sgstAmount,
      };

      await addDoc(collection(db, "tenants", tenantId, "bills"), billToSave);

      for (const product of bill.products || []) {
        if (product.stock && product.quantity) {
          const stockItem = stockList.find((s) => s.name === product.stock);
          if (stockItem?.id && !isNaN(Number(product.quantity))) {
            const newQty =
              (parseFloat(stockItem.quantity) || 0) -
              (parseFloat(product.quantity) || 0);
            const productRef = doc(
              db,
              "tenants",
              tenantId,
              "stocks",
              stockItem.id
            );
            await updateDoc(productRef, { quantity: newQty });
          }
        }
      }

      // ✅ Show dialog after saving
      setOpenPrintDialog(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Autofill name/address on phone change
  useEffect(() => {
    const fetchClientData = async () => {
      if (tenantId && phone && phone.length >= 6) {
        const billsRef = collection(db, "tenants", tenantId, "bills");
        const q = query(
          billsRef,
          where("client.contact", "==", phone),
          orderBy("client.date", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setName(data.client.name || "");
          setAddress(data.client.address || "");
        } else {
          setName("");
          setAddress("");
        }
      } else {
        setName("");
        setAddress("");
      }
    };
    fetchClientData();
  }, [phone, tenantId]);

  // Helper to normalize phone numbers (last 10 digits, digits only)
  function normalizePhone(phone) {
    return phone.replace(/\D/g, "").slice(-10);
  }

  // Fetch suggestion on phone change
  useEffect(() => {
    const fetchClientSuggestion = async () => {
      if (tenantId && phone && phone.length >= 6) {
        const searchPhone = normalizePhone(phone.trim());
        console.log("Searching for phone:", searchPhone);
        const billsRef = collection(db, "tenants", tenantId, "bills");
        const q = query(
          billsRef,
          where("client.contact", "==", searchPhone),
          orderBy("client.date", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        console.log("Found docs:", querySnapshot.docs.length);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setSuggestedName(data.client.name || "");
          setSuggestedAddress(data.client.address || "");
          setSuggestedServices(data.services || []);
          setSuggestedProducts(data.products || []);
          setShowSuggestion(true);
        } else {
          setSuggestedName("");
          setSuggestedAddress("");
          setSuggestedServices([]);
          setSuggestedProducts([]);
          setShowSuggestion(false);
        }
      } else {
        setSuggestedName("");
        setSuggestedAddress("");
        setSuggestedServices([]);
        setSuggestedProducts([]);
        setShowSuggestion(false);
      }
    };
    fetchClientSuggestion();
  }, [phone, tenantId]);

  // Handler to accept suggestion
  const handleAcceptSuggestion = () => {
    setName(suggestedName);
    setAddress(suggestedAddress);
    setShowSuggestion(false);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 3 }}>
      <Stack direction="row" justifyContent="flex-end" mb={2} spacing={2}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print Invoice
        </Button>
      </Stack>
      {/* Template Selection Modal */}
      <Dialog
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Choose Invoice Template</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            {TEMPLATES.map((tpl) => (
              <Box
                key={tpl.id}
                sx={{
                  border:
                    tpl.id === selectedTemplate
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  borderRadius: 2,
                  p: 1,
                  background: tpl.id === selectedTemplate ? "#e3f2fd" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedTemplate(tpl.id)}
              >
                {tpl.preview}
                <Typography
                  align="center"
                  sx={{
                    mt: 1,
                    fontWeight: tpl.id === selectedTemplate ? 700 : 400,
                  }}
                >
                  {tpl.id === selectedTemplate ? "Selected" : "Select"}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Editable Form Only (no invoice preview) */}
      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Business Info Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Business Information
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Business Name"
              value={businessInfo.businessName}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: true }}
              required
            />
            <TextField
              label="Business Address"
              value={businessInfo.businessAddress}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: true }}
              required
            />
            <TextField
              label="Business Address"
              value={businessInfo.businessAddress}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: true }}
              required
            />
            <TextField
              label="Business Email"
              value={businessInfo.businessEmail}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: true }}
              required
            />
            <TextField
              label="Business Phone"
              value={businessInfo.businessPhone}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: true }}
              required
            />
          </Stack>
        </Paper>
        {/* Client Info Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Client Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="Customer Contact Number"
                name="contact"
                value={phone}
                onChange={(e) => {
                  const input = e.target.value;
                  // Allow only digits and limit to 10 characters
                  if (/^\d{0,10}$/.test(input)) {
                    setPhone(input);
                  }
                }}
                type="tel"
                fullWidth
              />
              {showSuggestion && (suggestedName || suggestedAddress) && (
                <Box
                  sx={{
                    mt: 1,
                    background: "#f5f5f5",
                    p: 1,
                    borderRadius: 1,
                    border: "1px solid #ccc",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Suggestion from previous bill:
                  </Typography>
                  {suggestedName && (
                    <Typography variant="body2">
                      Name: <b>{suggestedName}</b>
                    </Typography>
                  )}
                  {suggestedAddress && (
                    <Typography variant="body2">
                      Address: <b>{suggestedAddress}</b>
                    </Typography>
                  )}
                  {suggestedServices.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Services Taken:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {suggestedServices.map((s, i) => (
                          <li key={i}>
                            {s.description} (x{s.quantity}) - ₹{s.rate}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  {suggestedProducts.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Products Purchased:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {suggestedProducts.map((p, i) => (
                          <li key={i}>
                            {p.description || p.stock} (x{p.quantity}) - ₹
                            {p.rate}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={handleAcceptSuggestion}
                  >
                    Use This Info
                  </Button>
                </Box>
              )}
            </Grid>
            <TextField
              label="Client Name"
              value={bill.client.name}
              onChange={(e) =>
                setBill((prev) => ({
                  ...prev,
                  client: { ...prev.client, name: e.target.value },
                }))
              }
              fullWidth
            />
            <Grid item xs={12} sm={6} md={4}>
              <TextField
  label="Date"
  name="date"
  type="date"
  value={bill.client.date || today}
  onChange={(e) =>
    setBill((prev) => ({
      ...prev,
      client: { ...prev.client, date: e.target.value },
    }))
  }
  fullWidth
  InputLabelProps={{ shrink: true }}
/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Invoice #"
                name="invoice"
                value={bill.client.invoice}
                onChange={(e) =>
                  setBill((prev) => ({
                    ...prev,
                    client: { ...prev.client, invoice: e.target.value },
                  }))
                }
                fullWidth
              />
            </Grid>
            <TextField
              label="Client Address"
              value={bill.client.address}
              onChange={(e) =>
                setBill((prev) => ({
                  ...prev,
                  client: { ...prev.client, address: e.target.value },
                }))
              }
              fullWidth
            />
          </Grid>
        </Paper>
        {/* Services Table Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Services
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell>Rate (₹)</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Subtotal (₹)</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(bill.services || []).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        value={row.description}
                        onChange={(e) =>
                          handleServiceChange(
                            idx,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth variant="standard">
                        <Select
                          value={row.staff || ""}
                          onChange={(e) =>
                            handleServiceChange(idx, "staff", e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em style={{ fontStyle: "normal" }}>None</em>
                          </MenuItem>
                          {employeeList.map((emp) => (
                            <MenuItem value={emp.name} key={emp.id}>
                              {emp.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.rate}
                        onChange={(e) =>
                          handleServiceChange(idx, "rate", e.target.value)
                        }
                        placeholder="Rate"
                        variant="standard"
                        type="number"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.quantity}
                        onChange={(e) =>
                          handleServiceChange(idx, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                        variant="standard"
                        type="number"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={calcSubtotal(row)}
                        variant="standard"
                        type="number"
                        fullWidth
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveService(idx)}
                        disabled={bill.services.length === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {idx === bill.services.length - 1 && (
                        <IconButton color="primary" onClick={handleAddService}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={2} xs={6} sm={6} md={6}>
              <TextField
                label=" Service Discount (%)"
                value={bill.discount}
                onChange={handleDiscountChange}
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
                helperText={`Discount: ₹${discountAmount.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 2 }
                )}`}
              />
            
          </Grid>
          <Divider sx={{ my: 2 }} />
        </Paper>
        {/* Products Table Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Products{" "}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Recommend </TableCell>
                  <TableCell>Rate (₹)</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Subtotal (₹)</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(bill.products || []).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        value={row.description}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth variant="standard">
                        <Select
                          value={row.stock || ""}
                          onChange={(e) =>
                            handleProductChange(idx, "stock", e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em style={{ fontStyle: "normal" }}>None</em>
                          </MenuItem>
                          {stockList.map((stock) => (
                            <MenuItem value={stock.name} key={stock.id}>
                              {stock.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth variant="standard">
                        <Select
                          value={row.staff || ""}
                          onChange={(e) =>
                            handleServiceChange(idx, "staff", e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em style={{ fontStyle: "normal" }}>None</em>
                          </MenuItem>
                          {employeeList.map((emp) => (
                            <MenuItem value={emp.name} key={emp.id}>
                              {emp.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.rate}
                        onChange={(e) =>
                          handleProductChange(idx, "rate", e.target.value)
                        }
                        placeholder="Rate"
                        variant="standard"
                        type="number"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.quantity}
                        onChange={(e) =>
                          handleProductChange(idx, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                        variant="standard"
                        type="number"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={calcSubtotal(row)}
                        variant="standard"
                        type="number"
                        fullWidth
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveProduct(idx)}
                        disabled={bill.products.length === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {idx === bill.products.length - 1 && (
                        <IconButton color="primary" onClick={handleAddProduct}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {/* Billing Details Section */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
          </Typography>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Product Discount (%)"
                value={bill.discount}
                onChange={handleDiscountChange}
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
                helperText={`Discount: ₹${discountAmount.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 2 }
                )}`}
              />
          <Grid container spacing={2} sx={{mt: 2}}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="CGST (%)"
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
                helperText={`CGST: ₹${cgstAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="SGST (%)"
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
                helperText={`SGST: ₹${sgstAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}`}
              />
            </Grid>
          </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                <Select
                  labelId="payment-mode-label"
                  name="paymentMode"
                  value={bill.client.paymentMode || ""}
                  label="Payment Mode"
                  onChange={handleClientChange}
                >
                  {paymentModes.map((mode) => (
                    <MenuItem value={mode.value} key={mode.value}>
                      {mode.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Total (INR):
                </Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ minWidth: 120, textAlign: "right" }}
                >
                  ₹{" "}
                  {total >= 0
                    ? total.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {/* <TextField
  label="Footer Note"
  // value={bill.footer || "Thank you for your business!"}
  fullWidth
  multiline
  minRows={2}
  InputProps={{
    readOnly: true,
  }}
/> */}
           <TextField
              label="Footer Note"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
        </Paper>
      </Stack>
      {/* Save Button at the bottom */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSaveInvoice}>
          Save Invoice
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)}>
        <DialogTitle>Do you want to print the bill?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPrintDialog(false);
              window.print();
            }}
            color="primary"
          >
            Yes
          </Button>

          <Button
            onClick={() => {
              setOpenPrintDialog(false);
              window.location.reload();
            }}
            color="secondary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bill;
