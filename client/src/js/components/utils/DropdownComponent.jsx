import Icon from "./Icon"
function DropdownComponent(props) {
    return (
        <div className="dropdown-component" onClick={props.onClick}>
            <Icon>{props.icon}</Icon>
            <a href={props.href}    >
                <div className="dropdown-component-title">{props.title}</div>
                <div className="text-annotation">{props.annotation}</div>
            </a>

        </div>
    )
}
export default DropdownComponent