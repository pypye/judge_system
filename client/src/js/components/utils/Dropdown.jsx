import React from 'react'

function Dropdown(props) {
    const container = React.createRef()
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        document.addEventListener("mousedown", onDropDownClose)
        return () => {
            document.removeEventListener("mousedown", onDropDownClose)
        }
    })

    const onDropdownChange = () => {
        setOpen(!open)
    }

    const onDropDownClose = (event) => {
        if (container.current && !container.current.contains(event.target)) {
            setOpen(false)
        }
    }

    return (
        <div ref={container}>
            <div onClick={onDropdownChange}>{props.trigger}</div>
            {(open === true) && (<div className={"dropdown dropdown-" + props.drop} > {props.children}</div>)}
        </div>
    )
}
export default Dropdown