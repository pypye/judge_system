import React from "react"
import { SessionContext } from "../../context"

function LeftSideComponent(props) {
    const session = React.useContext(SessionContext)

    return (
        <div>
            {(!props.admin || (props.admin === true && session.is_admin === 1)) &&
                <div className="leftside-component">
                    {props.children}
                </div>
            }
        </div>
    )
}
export default LeftSideComponent