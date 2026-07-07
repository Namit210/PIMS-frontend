import { IoBulbOutline } from "react-icons/io5";
export default function Disclaimer(){

    const headStyle={
        fontWeight:600,
        fontSize: "18px",
        padding: "10px 0 0 10px"
    }
    const disclaimerStyle={
        fontSize: "14px",
        background: "#f3ecdd",
        textAlign: "left",
        fontWeight:400,
        margin: "20px 0px",
    }

    const iconStyle={
        fontSize: "22px",
        marginRight: "5px",
        color: "#d6a103"
    }

    return(
        <div style={disclaimerStyle}>

        <h4 style={headStyle}><IoBulbOutline style={iconStyle} />Disclaimer</h4>

        <div style={{margin: "10px 5px"}} >
            <p className="disItem">
                1. Use only a bank account that matches your profile name.
            </p>
            <p className="disItem">
                2. Do not link the same bank account to multiple Task Planet accounts.
            </p >
            <p>
                3. Fraudulent activity may result in account blocking.
            </p>
        </div>
        
        </div>
    )
}