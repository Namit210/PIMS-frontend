import React from "react"
import { AiFillBank, AiOutlineEdit } from "react-icons/ai"
import { RxCrossCircled } from "react-icons/rx"

export default function PayCard({ type, input, onEdit, onDelete }) {
  let name, img;
  const imgStyle = {
    width: "30px",
    height: "30px",
    objectFit: "contain"
  }

  switch (type) {
    case "UPI":
      name = "UPI"
      img = <img src="src/assets/upi.png" alt={name} style={imgStyle} />
      break
    case "Paytm":
      name = "Paytm"
      img = <img src="src/assets/paytm.png" alt={name} style={imgStyle} />
      break
    case "PayPal":
    case "Paypal":
      name = "PayPal"
      img = <img src="src/assets/paypal.png" alt={name} style={imgStyle} />
      break
    case "USDT":
    case "BNB USDT":
      name = "BNB USDT"
      img = <img src="src/assets/usdt.png" alt={name} style={imgStyle} />
      break
    case "Bank":
      name = "Bank"
      img = <AiFillBank style={{ fontSize: "23px", color: "#aabd03" }} />
      break
    default:
      name = type || "UPI"
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
            {/* Display Bank Account Number or primary detail */}
            <div style={{ fontWeight: "600", color: "#1e1b24", marginBottom: "4px" }}>
              {input[1]}
            </div>
            <div>
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
              backgroundColor: "#ebece3",
              color: "#361c1c",
              border: "none",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "11px",
              fontWeight: "600"
            }}
          >
            {name}
          </button>
          {input[2] && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#b4b2bd", fontWeight: "500" }}>
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
