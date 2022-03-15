import React from "react"

const SessionContext = React.createContext()

const ProblemsetInfoContext = React.createContext({
    info: {},
    setInfo: () => { }
})

export {
    SessionContext,
    ProblemsetInfoContext
}