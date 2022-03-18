import Editor from '@monaco-editor/react'
import React from 'react'

function Submit() {
    var ref = React.createRef()
    const [language, setLanguage] = React.useState("cpp")

    const onLanguageChange = (event) => {
        setLanguage(event.target.value)
    }
    return (
        <form ref={ref}>
            <div className="text-heading">Submit solution</div>
            <div className="submit-info">
                <input className="text-input" placeholder="Problem ID" type="text" required/>
                <select className="text-input" value={language} onChange={onLanguageChange}>
                    <option value="cpp">.cpp</option>
                    <option value="c">.c</option>
                    <option value="java">.java</option>
                    <option value="pascal">.pas</option>
                    <option value="python">.py</option>
                </select>
            </div>
            <div>
                <Editor height="calc(min(350px, max(150px, 100vh - 430px)))" options={{automaticLayout: true}} language={language} />
            </div>

            <button type="submit" className="btn-submit">Submit</button>
        </form>
    )
}
export default Submit