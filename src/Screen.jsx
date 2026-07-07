import React, { useState, useEffect } from "react"
import Disclaimer from "./components/Disclaimer"
import Option from "./components/Option"
import PayCard from "./components/PayCard"
import PaymentModal from "./components/PaymentModal"
import { AiFillBank, AiOutlineBell, AiFillStar } from "react-icons/ai"



export default function Screen({ token, user, onLogout }) {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [paymentMethods, setPaymentMethods] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [editingIndex, setEditingIndex] = useState(-1) // index of payment method being edited, -1 for adding
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  // ==========================================
  // 2. LIFECYCLE / EFFECTS
  // ==========================================
  // Fetch linked payment methods from backend
  const fetchPayments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/payments`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && Array.isArray(data.payments)) {
        // Map backend schema objects back to frontend presentation inputs
        const formatted = data.payments.map(p => {
          let inputs = []
          if (p.paymentType === "Bank") {
            inputs = [
              p.bankFields.accountHolderName,
              p.bankFields.accountNumber,
              p.bankFields.ifscCode,
              p.bankFields.bankName,
              p.bankFields.branchName
            ]
          } else if (p.paymentType === "USDT") {
            inputs = [p.usdtAddress]
          } else if (p.paymentType === "UPI") {
            inputs = [p.upiid]
          } else if (p.paymentType === "Paytm") {
            inputs = [p.paytmNumber]
          } else if (p.paymentType === "PayPal") {
            inputs = [p.paypalEmail]
          }
          return {
            _id: p._id,
            type: p.paymentType,
            input: inputs
          }
        })
        setPaymentMethods(formatted)
      }
    } catch (err) {
      console.error("Error fetching payments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchPayments()
    }
  }, [token])

  // ==========================================
  // 3. ACTION HANDLERS
  // ==========================================
  const handleOptionClick = (optionName) => {
    setSelectedOption(optionName)
    setEditingIndex(-1)
    setModalOpen(true)
  }

  const handleEditClick = (index) => {
    const item = paymentMethods[index]
    setSelectedOption(item.type)
    setEditingIndex(index)
    setModalOpen(true)
  }

  // DELETE payment method from DB
  const handleDeleteClick = async (index) => {
    const targetId = paymentMethods[index]._id
    try {
      const response = await fetch(`${API_URL}/payments/${targetId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        // Refresh local listings
        fetchPayments()
      } else {
        alert(data.message || "Failed to remove payment method")
      }
    } catch (err) {
      console.error("Error deleting payment:", err)
    }
  }

  // POST / PUT payment method payload
  const handleModalSubmit = async (inputValues) => {
    let bodyData = {
      paymentType: selectedOption
    }

    // Map form inputs to match Mongoose backend schema fields
    if (selectedOption === "Bank") {
      bodyData.bankFields = {
        accountHolderName: inputValues[0],
        accountNumber: inputValues[1],
        ifscCode: inputValues[2],
        bankName: inputValues[3],
        branchName: inputValues[4]
      }
    } else if (selectedOption === "USDT") {
      bodyData.usdtAddress = inputValues[0]
    } else if (selectedOption === "UPI") {
      bodyData.upiid = inputValues[0]
    } else if (selectedOption === "Paytm") {
      bodyData.paytmNumber = inputValues[0]
    } else if (selectedOption === "PayPal") {
      bodyData.paypalEmail = inputValues[0]
    }

    try {
      if (editingIndex >= 0) {
        // Edit Mode: PUT /payments/:id
        const targetId = paymentMethods[editingIndex]._id
        const response = await fetch(`${API_URL}/payments/${targetId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(bodyData)
        })
        const data = await response.json()
        if (data.success) {
          fetchPayments()
        } else {
          alert(data.message || "Failed to update payment method")
        }
      } else {
        // Add Mode: POST /payments/pay
        const response = await fetch(`${API_URL}/payments/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(bodyData)
        })
        const data = await response.json()
        if (data.success) {
          fetchPayments()
        } else {
          alert(data.message || "Failed to save payment method")
        }
      }
    } catch (err) {
      console.error("Error saving payment method:", err)
    }

    setModalOpen(false)
  }

  // ==========================================
  // 4. INLINE STYLES CONFIGURATION
  // ==========================================
  const headerBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    height: "60px",
    boxSizing: "border-box"
  }

  const leftTextStyle = {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1e1b24"
  }

  const rightWidgetsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }

  const starBadgeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#fff5f5",
    border: "1px solid #ffe3e3",
    color: "#ff4d4f",
    padding: "4px 8px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "600"
  }

  const balanceBadgeStyle = {
    backgroundColor: "#f6ffed",
    border: "1px solid #d9f7be",
    color: "#389e0d",
    padding: "4px 10px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "600"
  }

  const bellStyle = {
    fontSize: "20px",
    color: "#1e1b24",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  }

  const avatarContainerStyle = {
    position: "relative",
    width: "36px",
    height: "36px"
  }

  const avatarCircleStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "conic-gradient(#28c76f 22%, #e2e8f0 22%)",
    padding: "2px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }

  const avatarInnerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#d946ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "12px",
    border: "2px solid #ffffff"
  }

  const progressPercentStyle = {
    position: "absolute",
    top: "-3px",
    right: "-3px",
    backgroundColor: "#28c76f",
    color: "#ffffff",
    fontSize: "8px",
    fontWeight: "700",
    borderRadius: "6px",
    padding: "1px 3px"
  }

  const sectionTitleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e1b24",
    margin: "12px 0px 8px 0px",
    textAlign: "left"
  }

  const gridStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "6px",
    marginBottom: "16px"
  }

  // ==========================================
  // 5. COMPONENT RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* 5.1 Sticky Top Header (Includes Clickable Profile Avatar to Log Out) */}
      <div style={headerBarStyle}>
        <div style={leftTextStyle}>My Payment...</div>
        <div style={rightWidgetsStyle}>
          {/* Clicking on the user avatar triggers logout */}
          <div 
            style={{ 
              fontSize: "13px", 
              fontWeight: "600", 
              color: "#e62929", 
              cursor: "pointer",
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2"
            }} 
            onClick={onLogout}
            title="Log Out"
          >
            Logout
          </div>
        </div>
      </div>

      {/* 5.2 Scrollable Content Wrapper */}
      <div 
        className="scrollable-content" 
        style={{ 
          paddingTop: "16px", 
          paddingBottom: "24px", 
          boxSizing: "border-box" 
        }}
      >
        {/* Add Payment Grid Options Section */}
        <h3 style={{ fontWeight: 600, margin: "10px 0px", textAlign: "center", color: "#1e1b24" }}>
          Add Payment Options
        </h3>
        <div style={gridStyle}>
          <Option 
            icon={<AiFillBank style={{ color: "#8b5a2b" }} />} 
            name="Bank" 
            onClick={() => handleOptionClick("Bank")} 
          />
          <Option 
            img="src/assets/usdt.png" 
            name="BNB USDT" 
            onClick={() => handleOptionClick("USDT")} 
          />
          <Option 
            img="src/assets/upi.png" 
            name="UPI" 
            onClick={() => handleOptionClick("UPI")} 
          />
          <Option 
            img="src/assets/paytm.png" 
            name={
              <span style={{ fontWeight: "700" }}>
                <span style={{ color: "#002970" }}>Pay</span>
                <span style={{ color: "#00b9f5" }}>tm</span>
              </span>
            } 
            onClick={() => handleOptionClick("Paytm")} 
          />
          <Option 
            img="src/assets/paypal.png" 
            name={
              <span style={{ fontStyle: "italic", fontWeight: "700" }}>
                <span style={{ color: "#3b148c" }}>Pay</span>
                <span style={{ color: "#0079c1" }}>Pal</span>
              </span>
            } 
            onClick={() => handleOptionClick("PayPal")} 
          />
        </div>

        {/* Linked Card List Section */}
        
        <div className="paycards">
          {loading && paymentMethods.length === 0 ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Loading Payments...</span>
            </div>
          ) : paymentMethods.length > 0 && (
            paymentMethods.map((method, index) => (
              <PayCard
                key={method._id}
                type={method.type}
                input={method.input}
                onEdit={() => handleEditClick(index)}
                onDelete={() => handleDeleteClick(index)}
              />
            ))
          ) }
        </div>

        {/* Disclaimer Section */}
        <Disclaimer />
      </div>

      {/* 5.3 Add/Edit Bottom-Sheet Modal overlay */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        option={selectedOption}
        onSubmit={handleModalSubmit}
        initialValues={editingIndex >= 0 ? paymentMethods[editingIndex].input : null}
      />
    </div>
  )
}