import React from "react"
import { SessionContext } from "../../context"

function RightSideComponent(props) {
    const session = React.useContext(SessionContext)
    return (
        <div>
            {(!props.admin || (props.admin === true && session.is_admin === true)) &&
                <div className="rightside-component">
                    {props.children}
                </div>
            }
        </div>
    )
}
export default RightSideComponent