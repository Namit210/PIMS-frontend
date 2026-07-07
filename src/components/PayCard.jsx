import React from "react"
import { AiFillBank, AiOutlineEdit } from "react-icons/ai"
import { RxCrossCircled } from "react-icons/rx"

import upiLogo from "../assets/upi.png"
import paytmLogo from "../assets/paytm.png"
import paypalLogo from "../assets/paypal.png"
import usdtLogo from "../assets/usdt.png"

export default function PayCard({ type, input, onEdit, onDelete }) {
  let name, img, altText;
  const imgStyle = {
    width: "30px",
    height: "30px",
    objectFit: "contain"
  }

  switch (type) {
    case "UPI":
      name = "UPI"
      altText = "UPI"
      img = <img src={upiLogo} alt={altText} style={imgStyle} />
      break
    case "Paytm":
      name = (
        <span style={{ fontWeight: "700" }}>
          <span style={{ color: "#002970" }}>Pay</span>
          <span style={{ color: "#00b9f5" }}>tm</span>
        </span>
      )
      altText = "Paytm"
      img = <img src={paytmLogo} alt={altText} style={imgStyle} />
      break
    case "PayPal":
    case "Paypal":
      name = (
        <span style={{ fontStyle: "italic", fontWeight: "700" }}>
          <span style={{ color: "#3b148c" }}>Pay</span>
          <span style={{ color: "#0079c1" }}>Pal</span>
        </span>
      )
      altText = "PayPal"
      img = <img src={paypalLogo} alt={altText} style={imgStyle} />
      break
    case "USDT":
    case "BNB USDT":
      name = "BNB USDT"
      altText = "BNB USDT"
      img = <img src={usdtLogo} alt={altText} style={imgStyle} />
      break
    case "Bank":
      name = "Bank"
      altText = "Bank"
      img = <AiFillBank style={{ fontSize: "23px", color: "#aabd03" }} />
      break
    default:
      name = type || "UPI"
      altText = type || "UPI"
      img = <AiFillBank style={{ fontSize: "23px", color: "#aabd03" }} />
  }

  const cardStyle = {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    overflow: "hidden"
  }

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px"
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: "15px",
              color: "#1e1b24"
            }}
          >
            {img} {name}
          </div>
          <div
            style={{
              margin: "8px 0 0 0",
              fontWeight: "500",
              fontSize: "15px",
              color: "#6e6b7b"
            }}
          >
            <div style={{ fontWeight: "600", color: "#1e1b24", marginBottom: "4px" }}>
              {type === "Bank" && input[1] ? (() => {
                const acc = String(input[1]);
                if (acc.length > 6) {
                  return acc.substring(0, 2) + "*".repeat(acc.length - 6) + acc.substring(acc.length - 4);
                }
                return acc;
              })() : input[1]}
            </div>
            <div style={{textAlign: "left", color: "#080808"}}>
              {input[0]}
            </div>
          </div>
        </div>

        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end"
          }}
        >
          <button
            style={{
              backgroundColor: "#1865e9",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "15px",
              fontWeight: "500"
            }}
          >
            {altText}
          </button>
          {input[2] && (
            <div style={{ marginTop: "8px", fontSize: "12px",  fontWeight: "500" }}>
              IFSC: {input[2]}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "#faf9fc"
        }}
      >
        <AiOutlineEdit
          onClick={onEdit}
          style={{
            fontSize: "20px",
            color: "#036bda",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        />

        <div
          onClick={onDelete}
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#e62929",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer"
          }}
        >
          <RxCrossCircled style={{ fontSize: 18 }} />
          <span>Remove Account</span>
        </div>
      </div>
    </div>
  )
}
