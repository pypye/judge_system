function NavigationLeftSide(props) {
    return (
        <div className="nav-leftside" onClick={props.onClick}>
            {props.title}
        </div>
    )
}
export default NavigationLeftSide