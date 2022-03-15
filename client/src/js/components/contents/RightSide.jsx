function RightSide(props){
    return (
        <div className="rightside" style={{width: props.width}}>
            {props.children}
        </div>
    )
}
export default RightSide