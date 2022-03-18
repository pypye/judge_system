function TableCell(props) {
    return (
        <td className="table-cell" style=
            {
                {
                    background: (props.color) ? props.color : 'white',
                    textAlign: (props.align) ? props.align : "center",
                    padding: (props.padding) ? props.padding : "0px"
                }
            }>
            <div className="table-cell-title">
                {props.title}
            </div>
            <div className="table-cell-annotation">
                {props.annotation}
            </div>
            {props.children}
        </td>
    )
}
export default TableCell