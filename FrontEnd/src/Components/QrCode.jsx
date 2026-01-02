import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaQrcode, FaMoneyCheckAlt, FaTrash, FaMagic } from 'react-icons/fa';
import "../Styles/QrCode.css";

function QrCode() {
    const [note, setNote] = useState("");
    const [upiId, setUpiId] = useState(() => {
        const savedUpi = localStorage.getItem("upiId");
        return savedUpi ? JSON.parse(savedUpi) : "";
    });

    const [amount, setAmount] = useState(() => {
        const savedAmount = localStorage.getItem("upiamount");
        return savedAmount ? JSON.parse(savedAmount) : "";
    });

    const [url, setUrl] = useState(() => {
        const savedUrl = localStorage.getItem("upiurl");
        return savedUrl ? JSON.parse(savedUrl) : "";
    });

    useEffect(() => {
        localStorage.setItem("upiId", JSON.stringify(upiId));
    }, [upiId]);

    useEffect(() => {
        localStorage.setItem("upiamount", JSON.stringify(amount));
    }, [amount]);

    useEffect(() => {
        localStorage.setItem("upiurl", JSON.stringify(url));
    }, [url]);

    const generateQr = (e) => {
        e.preventDefault();

        if (!upiId || !amount) {
            setNote("Enter valid UPI ID and Amount");
            return;
        }

        const baseUrl = `upi://pay?pa=${upiId}&pn=Payment&am=${amount}&cu=INR`;
        setNote("");
        setUrl(baseUrl);
    };

    const clear = () => {
        setUpiId("");
        setAmount('');
        setUrl("")

        localStorage.removeItem("upiId");
        localStorage.removeItem("upiamount");
        localStorage.removeItem("upiurl");
    }

    return (
        <div className="qr-container">
            <div className="qr-header">
                <FaQrcode className="qr-title-icon" />
                <h3 className="qr-title">UPI Payment Gateway</h3>
            </div>

            <div className="qr-content">
                <form className="qr-form" onSubmit={generateQr}>
                    <div className="input-group">
                        <label>UPI ID</label>
                        <input
                            type="text"
                            placeholder="example@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="generate-btn">
                            <FaMagic /> Generate QR
                        </button>
                        <button type="button" onClick={clear} className="clear-btn">
                            <FaTrash /> Clear
                        </button>
                    </div>
                    {note && <p className="qr-error">{note}</p>}
                </form>

                <div className="qr-display-section">
                    {url ? (
                        <div className="qr-result animate-fade-in">
                            <div className="qr-wrapper">
                                <QRCodeCanvas value={url} size={220} level="H" includeMargin={true} />
                            </div>
                            <div className="payment-details">
                                <p className="payment-amount">₹ {amount}</p>
                                <p className="payment-upi">{upiId}</p>
                                <div className="payment-status">
                                    <span className="pulse-dot"></span>
                                    UPI QR Active
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="qr-placeholder">
                            <FaMoneyCheckAlt className="placeholder-icon" />
                            <p>Enter details to generate payment QR</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QrCode;
