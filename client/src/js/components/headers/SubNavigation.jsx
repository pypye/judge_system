import NavigationComponent from "./NavigationComponent"

function SubNavigation() {
    return (
        <div className="content">
            <div className="sub-nav">
                <NavigationComponent path="/problemsets" title="Problems" />
                <NavigationComponent path="/problemsets/submit" title="Submit" />
                <NavigationComponent path="/problemsets/status" title="Status" />
                <NavigationComponent path="/problemsets/standings" title="Standings" />
            </div>
        </div>

    )
}
export default SubNavigation