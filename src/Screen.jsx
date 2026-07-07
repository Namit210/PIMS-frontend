import React, { useState } from "react"
import Disclaimer from "./components/Disclaimer"
import Option from "./components/Option"
import PayCard from "./components/PayCard"
import PaymentModal from "./components/PaymentModal"
import { AiFillBank, AiOutlineBell, AiFillStar } from "react-icons/ai"

export default function Screen() {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "UPI", input: ["abc@upi"] },
    { id: 2, type: "PayPal", input: ["abc@paypal.com"] },
    { id: 3, type: "Bank", input: ["Harish Chandra", "0000000000", "SBIN0001234", "State Bank of India", "Main Branch"] }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [editingIndex, setEditingIndex] = useState(-1) // index of payment method being edited, -1 for adding

  // ==========================================
  // 2. INTERACTION HANDLERS
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

  const handleDeleteClick = (index) => {
    setPaymentMethods(prev => prev.filter((_, i) => i !== index))
  }

  const handleModalSubmit = (inputValues) => {
    if (editingIndex >= 0) {
      // Edit Mode
      setPaymentMethods(prev => {
        const updated = [...prev]
        updated[editingIndex] = {
          ...updated[editingIndex],
          type: selectedOption,
          input: inputValues
        }
        return updated
      })
    } else {
      // Add Mode
      setPaymentMethods(prev => [
        ...prev,
        {
          id: Date.now(),
          type: selectedOption,
          input: inputValues
        }
      ])
    }
    setModalOpen(false)
  }

  // ==========================================
  // 3. INLINE STYLES CONFIGURATION
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
  // 4. COMPONENT RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* 4.1 Sticky Top Header */}
      <div style={headerBarStyle}>
        <div style={leftTextStyle}>My Payment...</div>
        <div style={rightWidgetsStyle}>
          <div style={starBadgeStyle}>
            <span>60</span>
            <AiFillStar style={{ color: "#faad14" }} />
          </div>
          <div style={balanceBadgeStyle}>$0.0000</div>
          <div style={bellStyle}>
            <AiOutlineBell />
          </div>
          <div style={avatarContainerStyle}>
            <div style={avatarCircleStyle}>
              <div style={avatarInnerStyle}>U</div>
            </div>
            <div style={progressPercentStyle}>22%</div>
          </div>
        </div>
      </div>

      {/* 4.2 Scrollable Content Wrapper */}
      <div 
        className="scrollable-content" 
        style={{ 
          paddingTop: "16px", 
          paddingBottom: "24px", 
          boxSizing: "border-box" 
        }}
      >
        {/* Add Payment Grid Options Section */}
        <h4 style={{ fontWeight: 600, margin: "5px 0px", textAlign: "center", color: "#1e1b24" }}>Add Payment Options</h4>
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
            name="Paytm" 
            onClick={() => handleOptionClick("Paytm")} 
          />
          <Option 
            img="src/assets/paypal.png" 
            name="PayPal" 
            onClick={() => handleOptionClick("PayPal")} 
          />
        </div>

        {/* Linked Card List Section */}
        <div className="paycards">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <PayCard
                key={method.id}
                type={method.type}
                input={method.input}
                onEdit={() => handleEditClick(index)}
                onDelete={() => handleDeleteClick(index)}
              />
            ))
          ) 
          : (
            <></>
          )}
        </div>

        {/* Disclaimer Section */}
        <Disclaimer />
      </div>

      {/* 4.3 Add/Edit Bottom-Sheet Modal overlay */}
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