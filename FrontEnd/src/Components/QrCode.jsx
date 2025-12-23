import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
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
            <h3 className="qr-title">UPI Payment QR</h3>

            <form className="qr-form" onSubmit={generateQr}>
                <input
                    type="text"
                    placeholder="UPI ID (example@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <button type="submit">Generate QR</button>
                <button onClick={clear}>Clear</button>
                {note && <p className="qr-error">{note}</p>}
            </form>

            {url && (
                <div className="qr-result">
                    <QRCodeCanvas value={url} size={220} />
                    <p>Scan & Pay ₹{amount}</p>
                </div>
            )}
        </div>
    );
}

export default QrCode;
