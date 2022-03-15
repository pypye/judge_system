function TableCell(props) {
    return (
        <td className="table-cell" style={{background: (props.color) ? props.color : 'white', textAlign: (props.align) ? props.align : "center"}}>
            <div className="table-cell-title">
                {props.title}
            </div>
            <div className="table-cell-annotation">
                {props.annotation}
            </div>

        </td>
    )
}
export default TableCell