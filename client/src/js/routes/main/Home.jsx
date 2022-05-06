import Content from "../../components/contents/Content"
import Header from "../../components/headers/Header"
import LeftSide from "../../components/contents/LeftSide"
import LeftSideComponent from "../../components/contents/LeftSideComponent"
import React from "react"

function Home() {
    React.useEffect(() => {
        document.title = "Home"
    })

    return (
        <React.Fragment>
            <Header />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        <div className="text-heading">Welcome to PhoCF Judge System.</div>
                    </LeftSideComponent>
                </LeftSide>
            </Content>

        </React.Fragment>

    )
}
export default Home