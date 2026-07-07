export default function Option({icon,name,img,onClick}){
    const optionStyle={
        backgroundColor: "#ebece3",
        padding: "10px 20px",
        margin: "0.5rem 0.3rem",
        width: "fit-content",
        height: "fit-content",
        borderRadius: "2rem",
        cursor: "pointer",
        alignItems: "center",
        display: "flex",
        gap: "3.5px"
    }

    const iconStyle={
        fontSize: "23px",
        color: "#aabd03"
    }

    const nameStyle={
        fontSize: "12px",
        fontWeight: 500,
        color: "#361c1c"
    }
    const image = (<img src={img} style={{  height: "23px", width: "auto" }} />)
    return(
        <div style={optionStyle} onClick={onClick}>
            {icon ? <span style={iconStyle}>{icon}</span> : image}
            <span style={nameStyle}>{name}</span>
        </div>
    )
}