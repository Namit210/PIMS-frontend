import React, { useState, useEffect } from "react"
import { AiOutlineSearch, AiOutlineCloseCircle, AiFillBank, AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineSafety, AiOutlineGlobal } from "react-icons/ai"

export default function AdminScreen({ token, user, onLogout }) {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filter input states
  const [username, setUsername] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [bankName, setBankName] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [paytmNumber, setPaytmNumber] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [usdtAddress, setUsdtAddress] = useState("")

  const API_URL = "http://localhost:3000"

  // ==========================================
  // 2. DATA FETCH & FILTER LOGIC
  // ==========================================
  const fetchAllPayments = async () => {
    setLoading(true)
    setError("")
    try {
      // Build query string
      const params = new URLSearchParams()
      if (username) params.append("username", username)
      if (paymentType) params.append("paymentType", paymentType)
      if (bankName) params.append("bankName", bankName)
      if (ifscCode) params.append("ifscCode", ifscCode)
      if (paytmNumber) params.append("paytmNumber", paytmNumber)
      if (upiId) params.append("upiId", upiId)
      if (paypalEmail) params.append("paypalEmail", paypalEmail)
      if (usdtAddress) params.append("usdtAddress", usdtAddress)

      const response = await fetch(`${API_URL}/payments/admin/all?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setPayments(data.payments || [])
      } else {
        setError(data.message || "Failed to fetch payments")
      }
    } catch (err) {
      console.error(err)
      setError("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  // Trigger query automatically when search filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllPayments()
    }, 300) // 300ms debounce to prevent spamming queries

    return () => clearTimeout(delayDebounceFn)
  }, [username, paymentType, bankName, ifscCode, paytmNumber, upiId, paypalEmail, usdtAddress])

  // Reset all search input filters
  const handleClearFilters = () => {
    setUsername("")
    setPaymentType("")
    setBankName("")
    setIfscCode("")
    setPaytmNumber("")
    setUpiId("")
    setPaypalEmail("")
    setUsdtAddress("")
  }

  // ==========================================
  // 3. RENDER HELPERS
  // ==========================================
  const renderPaymentDetails = (p) => {
    switch (p.paymentType) {
      case "Bank":
        return (
          <div style={detailsBoxStyle}>
            <div><strong>Holder:</strong> {p.bankFields?.accountHolderName}</div>
            <div><strong>Bank:</strong> {p.bankFields?.bankName}</div>
            <div><strong>A/C No:</strong> {p.bankFields?.accountNumber}</div>
            <div><strong>IFSC:</strong> {p.bankFields?.ifscCode}</div>
            <div><strong>Branch:</strong> {p.bankFields?.branchName}</div>
          </div>
        )
      case "USDT":
        return (
          <div style={detailsBoxStyle}>
            <strong>USDT Address:</strong> <span style={{ wordBreak: "break-all" }}>{p.usdtAddress}</span>
          </div>
        )
      case "UPI":
        return (
          <div style={detailsBoxStyle}>
            <strong>UPI ID:</strong> {p.upiid}
          </div>
        )
      case "Paytm":
        return (
          <div style={detailsBoxStyle}>
            <strong>Paytm Number:</strong> {p.paytmNumber}
          </div>
        )
      case "PayPal":
        return (
          <div style={detailsBoxStyle}>
            <strong>PayPal Email:</strong> {p.paypalEmail}
          </div>
        )
      default:
        return <div style={detailsBoxStyle}>No details available</div>
    }
  }

  // ==========================================
  // 4. INLINE STYLES CONFIGURATION
  // ==========================================
  const headerBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#1e1b24",
    color: "#ffffff",
    height: "60px",
    boxSizing: "border-box"
  }

  const headerTitleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.5px"
  }

  const logoutBtnStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#ffffff",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "6px",
    backgroundColor: "#e62929",
    border: "none"
  }

  const filterFormContainerStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "16px",
    textAlign: "left"
  }

  const filterInputWrapperStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    gap: "8px"
  }

  const filterInputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    background: "transparent",
    fontSize: "14px",
    color: "#1e1b24"
  }

  const detailsBoxStyle = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px 12px",
    marginTop: "8px",
    fontSize: "13px",
    color: "#334155",
    lineHeight: "1.4",
    textAlign: "left"
  }

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  }

  // ==========================================
  // 5. COMPONENT RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* 5.1 Admin Top Header bar */}
      <div style={headerBarStyle}>
        <div style={headerTitleStyle}>TaskPlanet Admin</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>Hi, {user?.name || "Admin"}</span>
          <button style={logoutBtnStyle} onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* 5.2 Scrollable Admin Area */}
      <div className="scrollable-content" style={{ paddingTop: "16px", paddingBottom: "24px", boxSizing: "border-box" }}>
        
        {/* Search & Filters Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e1b24", display: "flex", alignItems: "center", gap: "6px" }}>
            <AiOutlineSearch /> Search & Filters
          </h4>
          <button 
            onClick={handleClearFilters} 
            style={{ border: "none", background: "none", color: "#0284c7", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <AiOutlineCloseCircle /> Clear
          </button>
        </div>

        <div style={filterFormContainerStyle}>
          {/* Username Filter */}
          <div style={filterInputWrapperStyle}>
            <span style={{ color: "#64748b" }}><AiOutlineUser /></span>
            <input 
              style={filterInputStyle}
              type="text" 
              placeholder="Filter by Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {/* Payment Type Selection */}
          <div style={filterInputWrapperStyle}>
            <span style={{ color: "#64748b" }}><AiFillBank /></span>
            <select
              style={{ ...filterInputStyle, cursor: "pointer" }}
              value={paymentType}
              onChange={e => setPaymentType(e.target.value)}
            >
              <option value="">All Payment Types</option>
              <option value="Bank">Bank Account</option>
              <option value="USDT">USDT Wallet</option>
              <option value="UPI">UPI ID</option>
              <option value="Paytm">Paytm</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {/* Conditionally display fields or show all based on design */}
          {(!paymentType || paymentType === "Bank") && (
            <>
              <div style={filterInputWrapperStyle}>
                <span style={{ color: "#64748b" }}><AiFillBank /></span>
                <input 
                  style={filterInputStyle}
                  type="text" 
                  placeholder="Filter by Bank Name" 
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                />
              </div>
              <div style={filterInputWrapperStyle}>
                <span style={{ color: "#64748b" }}><AiOutlineSafety /></span>
                <input 
                  style={filterInputStyle}
                  type="text" 
                  placeholder="Filter by IFSC Code" 
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value)}
                />
              </div>
            </>
          )}

          {(!paymentType || paymentType === "Paytm") && (
            <div style={filterInputWrapperStyle}>
              <span style={{ color: "#64748b" }}><AiOutlinePhone /></span>
              <input 
                style={filterInputStyle}
                type="text" 
                placeholder="Filter by Paytm Number" 
                value={paytmNumber}
                onChange={e => setPaytmNumber(e.target.value)}
              />
            </div>
          )}

          {(!paymentType || paymentType === "UPI") && (
            <div style={filterInputWrapperStyle}>
              <span style={{ color: "#64748b" }}><AiOutlineMail /></span>
              <input 
                style={filterInputStyle}
                type="text" 
                placeholder="Filter by UPI ID" 
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
            </div>
          )}

          {(!paymentType || paymentType === "PayPal") && (
            <div style={filterInputWrapperStyle}>
              <span style={{ color: "#64748b" }}><AiOutlineMail /></span>
              <input 
                style={filterInputStyle}
                type="text" 
                placeholder="Filter by PayPal Email" 
                value={paypalEmail}
                onChange={e => setPaypalEmail(e.target.value)}
              />
            </div>
          )}

          {(!paymentType || paymentType === "USDT") && (
            <div style={filterInputWrapperStyle}>
              <span style={{ color: "#64748b" }}><AiOutlineGlobal /></span>
              <input 
                style={filterInputStyle}
                type="text" 
                placeholder="Filter by USDT Wallet Address" 
                value={usdtAddress}
                onChange={e => setUsdtAddress(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Query Results Section */}
        <h4 style={{ margin: "16px 0 10px 0", fontSize: "15px", fontWeight: "700", color: "#1e1b24", textAlign: "left" }}>
          User Payment Records ({payments.length})
        </h4>

        {error && <div style={{ color: "#ef4444", margin: "10px 0", fontSize: "14px" }}>{error}</div>}

        <div className="paycards">
          {loading && payments.length === 0 ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Searching Records...</span>
            </div>
          ) : payments.length > 0 ? (
            payments.map((p) => (
              <div key={p._id} style={cardStyle}>
                {/* Card Title Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#1e1b24" }}>
                      {p.user?.name || "Unknown User"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      {p.user?.email || "No email"}
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: "11px", 
                    fontWeight: "700", 
                    backgroundColor: "#ebece3", 
                    color: "#361c1c",
                    padding: "4px 8px",
                    borderRadius: "6px" 
                  }}>
                    {p.paymentType}
                  </span>
                </div>

                {/* Card Details Body */}
                {renderPaymentDetails(p)}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", padding: "30px", fontSize: "14px" }}>
              No matching user records found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
