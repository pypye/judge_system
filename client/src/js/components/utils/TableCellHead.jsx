function TableCellHead(props) {
    return (
        <th className="table-cell-head">
            <div className="table-cell-title">
                {props.title}
            </div>
            <div className="table-cell-head-annotation">
                {props.annotation}
            </div>
        </th>
    )
}
export default TableCellHead