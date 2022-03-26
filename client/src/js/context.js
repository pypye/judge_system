import React from "react"

const SessionContext = React.createContext({
    session: {},
    setSession: () => { }
})

const ProblemsetInfoContext = React.createContext({
    info: {},
    setInfo: () => { }
})

export {
    SessionContext,
    ProblemsetInfoContext
}