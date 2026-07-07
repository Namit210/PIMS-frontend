import React, { useState, useEffect } from "react"
import { 
  AiOutlineSearch, 
  AiOutlineCloseCircle, 
  AiFillBank, 
  AiOutlineUser, 
  AiOutlinePhone, 
  AiOutlineMail, 
  AiOutlineSafety, 
  AiOutlineGlobal, 
  AiOutlineFilter, 
  AiOutlineDown, 
  AiOutlineUp 
} from "react-icons/ai"

export default function AdminScreen({ token, user, onLogout }) {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedCardId, setExpandedCardId] = useState(null)

  // Search & Filter input state variables
  const [username, setUsername] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [bankName, setBankName] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [paytmNumber, setPaytmNumber] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [usdtAddress, setUsdtAddress] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  // ==========================================
  // 2. LIFECYCLE / DATA FETCH LOGIC
  // ==========================================
  // Fetch filtered payments list from DB
  const fetchAllPayments = async () => {
    setLoading(true)
    setError("")
    try {
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
      console.error("Admin fetch error:", err)
      setError("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  // Automatic live search query trigger (debounced by 300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllPayments()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [username, paymentType, bankName, ifscCode, paytmNumber, upiId, paypalEmail, usdtAddress])

  // ==========================================
  // 3. ACTION HANDLERS
  // ==========================================
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
  // 4. RENDER HELPERS
  // ==========================================
  // Map payment options to standard branded logo graphics and casing
  const getPaymentTypeDetails = (type) => {
    const imgStyle = {
      width: "18px",
      height: "18px",
      objectFit: "contain"
    };
    switch (type) {
      case "UPI":
        return {
          name: "UPI",
          img: <img src="src/assets/upi.png" alt="UPI" style={imgStyle} />
        };
      case "Paytm":
        return {
          name: (
            <span style={{ fontWeight: "700" }}>
              <span style={{ color: "#002970" }}>Pay</span>
              <span style={{ color: "#00b9f5" }}>tm</span>
            </span>
          ),
          img: <img src="src/assets/paytm.png" alt="Paytm" style={imgStyle} />
        };
      case "PayPal":
        return {
          name: (
            <span style={{ fontStyle: "italic", fontWeight: "700" }}>
              <span style={{ color: "#3b148c" }}>Pay</span>
              <span style={{ color: "#0079c1" }}>Pal</span>
            </span>
          ),
          img: <img src="src/assets/paypal.png" alt="PayPal" style={imgStyle} />
        };
      case "USDT":
        return {
          name: "BNB USDT",
          img: <img src="src/assets/usdt.png" alt="USDT" style={imgStyle} />
        };
      case "Bank":
        return {
          name: "Bank Account",
          img: <AiFillBank style={{ fontSize: "16px", color: "#aabd03" }} />
        };
      default:
        return {
          name: type,
          img: <AiFillBank style={{ fontSize: "16px", color: "#aabd03" }} />
        };
    }
  }

  // Format details content based on payment type
  const renderPaymentDetails = (p) => {
    switch (p.paymentType) {
      case "Bank":
        return (
          <div style={detailsBoxStyle}>
            <div><strong>Holder Name:</strong> {p.bankFields?.accountHolderName}</div>
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
  // 5. INLINE STYLES CONFIGURATION
  // ==========================================
  const headerBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    color: "#1e1b24",
    height: "60px",
    borderBottom: "1px solid #e2e8f0",
    boxSizing: "border-box"
  }

  const headerTitleStyle = {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1e1b24"
  }

  const logoutBtnStyle = {
    fontSize: "13px", 
    fontWeight: "600", 
    color: "#e62929", 
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: "6px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2"
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
    backgroundColor: "#ffffff",
    gap: "8px",
    boxSizing: "border-box"
  }

  const filterInputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    background: "transparent",
    fontSize: "14px",
    color: "#1e1b24"
  }

  const filterSelectWrapperStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    gap: "8px",
    boxSizing: "border-box"
  }

  const filterSelectStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    background: "transparent",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: "500",
    color: "#1e1b24",
    cursor: "pointer",
    paddingLeft: "6px"
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
  // 6. COMPONENT RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* 6.1 Sticky Top Header (Matching user theme) */}
      <div style={headerBarStyle}>
        <div style={headerTitleStyle}>TaskPlanet Admin</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", opacity: 0.8, color: "#64748b", fontWeight: "500" }}>
            Hi, {user?.name || "Admin"}
          </span>
          <button style={logoutBtnStyle} onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* 6.2 Scrollable Dashboard Content */}
      <div className="scrollable-content" style={{ paddingTop: "16px", paddingBottom: "24px", boxSizing: "border-box" }}>
        
        {/* Search Bar & Filter Toggle button */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {/* Main Username search input */}
          <div style={{ ...filterInputWrapperStyle, flex: 1, padding: "10px 12px" }}>
            <span style={{ color: "#64748b", display: "flex", alignItems: "center", fontSize: "18px" }}><AiOutlineSearch /></span>
            <input 
              style={filterInputStyle}
              type="text" 
              placeholder="Search by username..." 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            {username && (
              <span 
                onClick={() => setUsername("")} 
                style={{ color: "#b4b2bd", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center" }}
              >
                <AiOutlineCloseCircle />
              </span>
            )}
          </div>

          {/* Filter Toggle Button using React Icons */}
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: showFilters ? "#f0f9ff" : "#ffffff",
              border: "1px solid #cbd5e1",
              borderColor: showFilters ? "#0284c7" : "#cbd5e1",
              color: showFilters ? "#0284c7" : "#1e1b24",
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              fontSize: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxSizing: "border-box"
            }}
            title={showFilters ? "Hide Filters" : "Filters"}
          >
            <AiOutlineFilter />
          </button>
        </div>

        {/* Clear Filters & Record Count bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            {(paymentType || bankName || ifscCode || paytmNumber || upiId || paypalEmail || usdtAddress) && (
              <button 
                onClick={handleClearFilters} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#ef4444",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                <AiOutlineCloseCircle /> Clear Advanced Filters
              </button>
            )}
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
            {payments.length} records found
          </span>
        </div>

        {/* Collapsible search fields panel */}
        {showFilters && (
          <div style={filterFormContainerStyle}>

            {/* Payment Type dropdown selection */}
            <div style={filterSelectWrapperStyle}>
              <span style={{ color: "#64748b" }}><AiFillBank /></span>
              <select
                style={filterSelectStyle}
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

            {/* Bank details filter inputs */}
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

            {/* Paytm filter input */}
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

            {/* UPI filter input */}
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

            {/* PayPal filter input */}
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

            {/* USDT filter input */}
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
        )}

        {/* Grouped User Records Accordions list */}
        <h4 style={{ margin: "16px 0 10px 0", fontSize: "15px", fontWeight: "700", color: "#1e1b24", textAlign: "left" }}>
          User Payment Records
        </h4>

        {error && <div style={{ color: "#ef4444", margin: "10px 0", fontSize: "14px" }}>{error}</div>}

        <div className="paycards">
          {loading && payments.length === 0 ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Searching Records...</span>
            </div>
          ) : payments.length > 0 ? (
            (() => {
              // Group payments by unique user ID string key
              const groupedUsers = [];
              const userMap = {};
              
              payments.forEach(p => {
                if (!p.user) return;
                const userId = typeof p.user === "object" ? String(p.user._id || p.user.id) : String(p.user);
                
                if (!userMap[userId]) {
                  userMap[userId] = {
                    user: typeof p.user === "object" ? p.user : { name: p.user, email: "" },
                    methods: []
                  };
                  groupedUsers.push(userMap[userId]);
                }
                userMap[userId].methods.push(p);
              });

              // Map each user as a collapsible accordion strip
              return groupedUsers.map((item) => {
                const isExpanded = expandedCardId === item.user._id;
                return (
                  <div 
                    key={item.user._id} 
                    style={{ 
                      ...cardStyle, 
                      padding: "12px 16px", 
                      marginBottom: "8px",
                      cursor: "pointer" 
                    }}
                    onClick={() => setExpandedCardId(isExpanded ? null : item.user._id)}
                  >
                    {/* User Accordion Header Strip */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "#1e1b24" }}>
                          {item.user.name || "Unknown User"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "1px" }}>
                          {item.user.email || "No email"}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ 
                          fontSize: "11px", 
                          fontWeight: "700", 
                          backgroundColor: "#e0f2fe", 
                          color: "#0369a1",
                          padding: "3px 6px",
                          borderRadius: "6px" 
                        }}>
                          {item.methods.length} {item.methods.length === 1 ? "Option" : "Options"}
                        </span>
                        {isExpanded ? (
                          <AiOutlineUp style={{ color: "#64748b", fontSize: "13px" }} />
                        ) : (
                          <AiOutlineDown style={{ color: "#64748b", fontSize: "13px" }} />
                        )}
                      </div>
                    </div>

                    {/* Accordion Body displaying linked payment sub-cards */}
                    {isExpanded && (
                      <div style={{ marginTop: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "4px" }}>
                        {item.methods.map((method) => (
                          <div 
                            key={method._id} 
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              padding: "10px",
                              marginTop: "8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.01)"
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent bubble toggle on accordion
                          >
                            {/* Branded subcard header */}
                            {(() => {
                              const details = getPaymentTypeDetails(method.paymentType);
                              return (
                                <div style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#1e1b24",
                                  borderBottom: "1px solid #e2e8f0",
                                  paddingBottom: "6px",
                                  marginBottom: "6px",
                                  textAlign: "left",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}>
                                  {details.img} {details.name}
                                </div>
                              );
                            })()}
                            {/* Detailed fields list */}
                            {renderPaymentDetails(method)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
            })()
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
