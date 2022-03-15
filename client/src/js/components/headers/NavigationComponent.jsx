import Icon from '../utils/Icon';

function NavigationComponent(props) {
    return (
        <a href={props.path} className="nav-component" style={props.uppercase && { textTransform: 'uppercase' }}>
            {(props.icon) && <div className="nav-icon"><Icon> {props.icon}</Icon></div>}
            {props.title}
        </a>
    )
}
export default NavigationComponent