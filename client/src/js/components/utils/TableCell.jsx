import React from "react"

function TableCell(props) {
    return (
        <td className="table-cell" onClick={props.onClick} style=
            {
                {
                    background: (props.color) ? props.color : 'white',
                    textAlign: (props.align) ? props.align : "center",
                    padding: (props.padding) ? props.padding : "0px"
                }
            }>
            {(props.href ? <a href={props.href} style={{textDecoration: "underline", color: 'blue'}}>{props.title}</a> : <div >{props.title}</div>)}
            <div className="table-cell-annotation" >
                {props.annotation}
            </div>
            {props.children}
        </td>
    )
}
export default TableCell