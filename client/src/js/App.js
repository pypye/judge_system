import Axios from 'axios'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Contest from './routes/contests/Contest'
import Login from './routes/main/Login'
import Home from './routes/main/Home'
import Problemset from './routes/problemsets/Problemset'
import ProblemsetStandings from './routes/problemsets/ProblemsetStandings'
import ProblemsetStatus from './routes/problemsets/ProblemsetStatus'
import ProblemsetSubmit from './routes/problemsets/ProblemsetSubmit'
import ProblemsetEdit from './routes/problemsets/problemset_edit/ProblemsetEdit'

import { SessionContext } from './context'

function App() {
    const [session, setSession] = React.useState(null)
    const routes = [
        { path: '/', component: <Home /> },
        { path: '/contests', component: <Contest /> },
        { path: '/problemsets', component: <Problemset /> },
        { path: '/problemsets/submit', component: <ProblemsetSubmit /> },
        { path: '/problemsets/status', component: <ProblemsetStatus /> },
        { path: '/problemsets/standings', component: <ProblemsetStandings /> },
        { path: '/problemsets/edit', component: <ProblemsetEdit />, admin: true }
    ]

    React.useEffect(() => {
        Axios.get("http://localhost:3001/login", { withCredentials: true }).then(res => {
            setSession(res.data)
        })
    })

    const render = (component, admin) => {
        if (!session) return <div></div>
        if (admin && session.is_admin !== 1) return <div>Not allow </div>
        if (session.logged_in) return component
        else return <Login />
    }

    return (
        <SessionContext.Provider value={session}>
            <Router>
                <Routes>
                    {routes.map(route => <Route key={route.path} exact path={route.path} element={render(route.component, route.admin)} />)}
                </Routes>
            </Router>
        </SessionContext.Provider>
    )
}

export default App
