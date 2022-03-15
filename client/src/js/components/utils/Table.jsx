import React from "react"

function Table(props) {
    var tableRef = React.createRef();

    React.useEffect(() => {
        if (props.fixedColumn) {
            var array = new Array(props.fixedColumn.length).fill(0)
            var element = Array.from(tableRef.current.children[0].children)

            element.forEach(children => {
                props.fixedColumn.forEach((val, key) => {
                    array[key] = Math.max(array[key], children.children[val].clientWidth)
                })
            })

            element.forEach(children => {
                var sum = 0
                props.fixedColumn.forEach((val, key) => {
                    children.children[val].style.width = array[key] + 'px'
                    children.children[val].style.position = 'sticky'
                    children.children[val].style.left = sum + 'px'
                    if (key === array.length - 1) {
                        children.children[val].style.borderRight = '1px solid #bbb'
                    }
                    sum += array[key]
                })
            })
        }
    }, [tableRef, props.fixedColumn])

    return (
        <div className="table-div">
            <table className="table" ref={tableRef}>
                <tbody>
                    {props.children}
                </tbody>

            </table>
        </div>

    )
}
export default Table