import React, { useState, useEffect, useRef } from "react"
import { 
  AiFillBank, 
  AiOutlineUser, 
  AiOutlineCreditCard, 
  AiOutlineSafety, 
  AiFillCheckCircle, 
  AiOutlineClose,
  AiOutlineGlobal,
  AiOutlineMail,
  AiOutlinePhone
} from "react-icons/ai"

import upiLogo from "../assets/upi.png"
import paytmLogo from "../assets/paytm.png"
import paypalLogo from "../assets/paypal.png"
import usdtLogo from "../assets/usdt.png"

export default function PaymentModal({ isOpen, onClose, option, onSubmit, initialValues }) {
  // ==========================================
  // 1. STATE & REF DEFINITIONS
  // ==========================================
  const [formValues, setFormValues] = useState({
    primary: "",               // Paytm Number, UPI ID, PayPal Email, USDT Address
    confirm: "",               // Confirmation of primary field
    accountHolderName: "",     // Bank Account holder
    bankName: "",              // Bank name
    ifscCode: "",              // IFSC Code
    branchName: "",            // Bank Branch name
    accountNumber: "",         // Bank Account number
    confirmAccountNumber: ""   // Confirmation of bank account number
  })

  const [errors, setErrors] = useState({})
  const modalRef = useRef(null)

  // ==========================================
  // 2. LIFECYCLE EFFECTS
  // ==========================================
  // Sync form values when the modal opens or payment method changes
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        if (option === "Bank") {
          setFormValues({
            accountHolderName: initialValues[0] || "",
            accountNumber: initialValues[1] || "",
            confirmAccountNumber: initialValues[1] || "",
            ifscCode: initialValues[2] || "",
            bankName: initialValues[3] || "",
            branchName: initialValues[4] || "",
            primary: "",
            confirm: ""
          })
        } else {
          setFormValues({
            primary: initialValues[0] || "",
            confirm: initialValues[0] || "",
            accountHolderName: "",
            bankName: "",
            ifscCode: "",
            branchName: "",
            accountNumber: "",
            confirmAccountNumber: ""
          })
        }
      } else {
        // Reset to empty for new forms
        setFormValues({
          primary: "",
          confirm: "",
          accountHolderName: "",
          bankName: "",
          ifscCode: "",
          branchName: "",
          accountNumber: "",
          confirmAccountNumber: ""
        })
      }
      setErrors({})
    }
  }, [isOpen, option, initialValues])

  if (!isOpen) return null

  // ==========================================
  // 3. UI HELPERS & CONFIGURATION
  // ==========================================
  // Helper to fetch matching assets, placeholders, and icons for each type
  const getOptionAssets = () => {
    switch (option) {
      case "Bank":
        return {
          title: "Bank Account",
          icon: <AiFillBank style={{ fontSize: "24px", color: "#aabd03" }} />,
          primaryPlaceholder: "",
          primaryIcon: <AiOutlineUser />
        }
      case "USDT":
      case "BNB USDT":
        return {
          title: "BNB USDT Address",
          icon: <img src={usdtLogo} alt="USDT" style={{ width: "24px", height: "24px" }} />,
          primaryPlaceholder: "Enter BNB USDT Address",
          primaryIcon: <img src={usdtLogo} alt="USDT" style={{ width: "18px", height: "18px" }} />
        }
      case "UPI":
        return {
          title: "UPI ID",
          icon: <img src={upiLogo} alt="UPI" style={{ width: "24px", height: "24px" }} />,
          primaryPlaceholder: "Enter UPI ID",
          primaryIcon: <img src={upiLogo} alt="UPI" style={{ width: "18px", height: "18px" }} />
        }
      case "Paytm":
        return {
          title: "Paytm Number",
          icon: <img src={paytmLogo} alt="Paytm" style={{ width: "24px", height: "24px" }} />,
          primaryPlaceholder: "Enter Paytm Number",
          primaryIcon: <AiOutlinePhone />
        }
      case "PayPal":
      case "Paypal":
        return {
          title: "PayPal Email",
          icon: <img src={paypalLogo} alt="PayPal" style={{ width: "24px", height: "24px" }} />,
          primaryPlaceholder: "Enter PayPal Email Address",
          primaryIcon: <AiOutlineMail />
        }
      default:
        return {
          title: option,
          icon: <AiOutlineGlobal style={{ fontSize: "24px" }} />,
          primaryPlaceholder: `Enter ${option} details`,
          primaryIcon: <AiOutlineGlobal />
        }
    }
  }

  const assets = getOptionAssets()

  // ==========================================
  // 4. HANDLERS & FORM VALIDATIONS
  // ==========================================
  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear field-specific error dynamically
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Validate form before submit
  const validate = () => {
    const tempErrors = {}
    
    if (option === "Bank") {
      if (!formValues.accountHolderName.trim()) tempErrors.accountHolderName = "Account holder's name is required"
      if (!formValues.bankName.trim()) tempErrors.bankName = "Bank name is required"
      if (!formValues.ifscCode.trim()) tempErrors.ifscCode = "IFSC code is required"
      if (!formValues.branchName.trim()) tempErrors.branchName = "Branch name is required"
      if (!formValues.accountNumber.trim()) {
        tempErrors.accountNumber = "Account number is required"
      }
      if (formValues.accountNumber !== formValues.confirmAccountNumber) {
        tempErrors.confirmAccountNumber = "Account numbers do not match"
      }
    } else {
      if (!formValues.primary.trim()) {
        tempErrors.primary = "This field is required"
      }
      if (formValues.primary !== formValues.confirm) {
        tempErrors.confirm = "Fields do not match"
      }

      // Format validations
      if (option === "PayPal" || option === "Paypal") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formValues.primary && !emailRegex.test(formValues.primary)) {
          tempErrors.primary = "Please enter a valid email address"
        }
      } else if (option === "Paytm") {
        const phoneRegex = /^[0-9]{10}$/
        if (formValues.primary && !phoneRegex.test(formValues.primary)) {
          tempErrors.primary = "Please enter a valid 10-digit number"
        }
      } else if (option === "UPI") {
        if (formValues.primary && !formValues.primary.includes("@")) {
          tempErrors.primary = "Please enter a valid UPI ID (contains @)"
        }
      }
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      if (option === "Bank") {
        onSubmit([
          formValues.accountHolderName,
          formValues.accountNumber,
          formValues.ifscCode.toUpperCase(),
          formValues.bankName,
          formValues.branchName
        ])
      } else {
        onSubmit([formValues.primary])
      }
    }
  }

  // Handle clicking outside modal to close (light-dismiss fallback)
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  // Reactive state check to disable/enable submission button
  const isFormValid = () => {
    if (option === "Bank") {
      return (
        formValues.accountHolderName.trim() &&
        formValues.bankName.trim() &&
        formValues.ifscCode.trim() &&
        formValues.branchName.trim() &&
        formValues.accountNumber.trim() &&
        formValues.accountNumber === formValues.confirmAccountNumber
      )
    } else {
      if (!formValues.primary.trim() || formValues.primary !== formValues.confirm) return false
      
      if (option === "PayPal" || option === "Paypal") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.primary)
      }
      if (option === "Paytm") {
        return /^[0-9]{10}$/.test(formValues.primary)
      }
      if (option === "UPI") {
        return formValues.primary.includes("@")
      }
      return true
    }
  }

  const isEdit = !!initialValues

  // ==========================================
  // 5. COMPONENT RENDER
  // ==========================================
  return (
    <div className="payment-modal-backdrop" onClick={handleBackdropClick}>
      <div className="payment-modal-sheet" ref={modalRef} onClick={e => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button className="payment-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <AiOutlineClose />
        </button>

        {/* Drag Handle */}
        <div className="payment-modal-drag-handle"></div>

        {/* Header */}
        <div className="payment-modal-header">
          <span className="payment-modal-title">
            {isEdit ? "Edit" : "Add"} {assets.title}
          </span>
          <div className="payment-modal-header-icon-circle">
            {assets.icon}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {option === "Bank" ? (
            <>
              {/* Account Holder's Name */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon"><AiOutlineUser /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Enter Account Holder's Name"
                  value={formValues.accountHolderName}
                  onChange={e => handleInputChange("accountHolderName", e.target.value)}
                />
              </div>
              {errors.accountHolderName && <div className="payment-modal-error">{errors.accountHolderName}</div>}

              {/* Bank Name */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon"><AiFillBank /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Enter Bank Name"
                  value={formValues.bankName}
                  onChange={e => handleInputChange("bankName", e.target.value)}
                />
              </div>
              {errors.bankName && <div className="payment-modal-error">{errors.bankName}</div>}

              {/* IFSC Code */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon"><AiOutlineSafety /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Enter IFSC Code"
                  value={formValues.ifscCode}
                  onChange={e => handleInputChange("ifscCode", e.target.value)}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              {errors.ifscCode && <div className="payment-modal-error">{errors.ifscCode}</div>}

              {/* Branch Name */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon"><AiOutlineGlobal /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Enter Branch Name"
                  value={formValues.branchName}
                  onChange={e => handleInputChange("branchName", e.target.value)}
                />
              </div>
              {errors.branchName && <div className="payment-modal-error">{errors.branchName}</div>}

              {/* Account Number */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon"><AiOutlineCreditCard /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Enter Account Number"
                  value={formValues.accountNumber}
                  onChange={e => handleInputChange("accountNumber", e.target.value)}
                />
              </div>
              {errors.accountNumber && <div className="payment-modal-error">{errors.accountNumber}</div>}

              {/* Confirm Account Number */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon" style={{ color: "#28c76f" }}><AiFillCheckCircle /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder="Confirm Account Number"
                  value={formValues.confirmAccountNumber}
                  onChange={e => handleInputChange("confirmAccountNumber", e.target.value)}
                />
              </div>
              {formValues.confirmAccountNumber && formValues.accountNumber !== formValues.confirmAccountNumber && (
                <div className="payment-modal-error">Account numbers do not match</div>
              )}
            </>
          ) : (
            <>
              {/* Primary Input */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon">{assets.primaryIcon}</span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder={assets.primaryPlaceholder}
                  value={formValues.primary}
                  onChange={e => handleInputChange("primary", e.target.value)}
                />
              </div>
              {errors.primary && <div className="payment-modal-error">{errors.primary}</div>}

              {/* Confirmation Input */}
              <div className="payment-modal-input-wrapper">
                <span className="payment-modal-input-icon" style={{ color: "#28c76f" }}><AiFillCheckCircle /></span>
                <input
                  type="text"
                  className="payment-modal-input"
                  placeholder={`Confirm ${assets.title}`}
                  value={formValues.confirm}
                  onChange={e => handleInputChange("confirm", e.target.value)}
                />
              </div>
              {formValues.confirm && formValues.primary !== formValues.confirm && (
                <div className="payment-modal-error">Fields do not match</div>
              )}
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="payment-modal-submit-btn"
            disabled={!isFormValid()}
          >
            {isEdit ? "Update" : "Add"} {assets.title}
          </button>
        </form>
      </div>
    </div>
  )
}
