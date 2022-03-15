function LeftSide(props){
    return (
        <div className="leftside" style={{width: props.width}}>
            {props.children}
        </div>
    )
}
export default LeftSide