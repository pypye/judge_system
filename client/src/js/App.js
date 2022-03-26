import Axios from 'axios'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './routes/main/Login'
import Home from './routes/main/Home'
import Problemset from './routes/problemsets/Problemset'
import ProblemsetStandings from './routes/problemsets/ProblemsetStandings'
import ProblemsetStatus from './routes/problemsets/ProblemsetStatus'
import ProblemsetSubmit from './routes/problemsets/submit/ProblemsetSubmit'
import ProblemsetCreate from './routes/problemsets/create/ProblemsetCreate'
import { SessionContext } from './context'
import ProblemsetShow from './routes/problemsets/ProblemsetShow'

function App() {
    const [session, setSession] = React.useState(null)
    const routes = [
        { path: '/', component: <Home /> },
        { path: '/problemsets', component: <Problemset /> },
        { path: '/problemsets/problem/:id', component: <ProblemsetShow /> },
        
        { path: '/problemsets/submit', component: <ProblemsetSubmit /> },
        { path: '/problemsets/status', component: <ProblemsetStatus /> },
        { path: '/problemsets/standings', component: <ProblemsetStandings /> },
        { path: '/problemsets/create', component: <ProblemsetCreate />, admin: true },
        { path: '/problemsets/problem/:id/edit', component: <ProblemsetCreate edit/>, admin: true }
    ]

    React.useEffect(() => {
        Axios.get("http://localhost:3001/login", { withCredentials: true }).then(res => {
            setSession(res.data)
        })
    }, [])

    const render = (component, admin) => {
        if (!session) return <div></div>
        if (session.logged_in) {
            if (admin && session.role !== 1) return <div>Not allow </div>
            else return component
        }
        else return <Login />
    }

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            <Router>
                <Routes>
                    {routes.map(route => <Route key={route.path} exact path={route.path} element={render(route.component, route.admin)} />)}
                </Routes>
            </Router>
        </SessionContext.Provider>
    )
}

export default App
