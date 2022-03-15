import Content from "../../components/contents/Content"
import Header from "../../components/headers/Header"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"
import React from "react"

function Contest() {
    React.useEffect(() => {
        document.title = "Contest"
    })
    
    return (
        <div>
            <Header />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        this is contest page
                    </LeftSideComponent>
                </LeftSide>
            </Content>
        </div>

    )
}
export default Contest