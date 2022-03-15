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
        <div>
            <Header />
            <Content>
                <LeftSide width="100%">
                    <LeftSideComponent>
                        this is home page
                    </LeftSideComponent>
                </LeftSide>
            </Content>

        </div>

    )
}
export default Home