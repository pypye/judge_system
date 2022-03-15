import Icon from "./Icon"
function DropdownComponent(props) {
    return (
        <div className="dropdown-component" onClick={props.onClick}>
            <Icon>{props.icon}</Icon>
            <div>
                <div className="dropdown-component-title">{props.title}</div>
                <div className="text-annotation">{props.annotation}</div>
            </div>

        </div>
    )
}
export default DropdownComponent