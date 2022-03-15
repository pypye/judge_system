import Editor from '@monaco-editor/react'
import React from 'react'

function Submit() {
    var ref = React.createRef()
    const [language, setLanguage] = React.useState("cpp")

    const onLanguageChange = (event) => {
        setLanguage(event.target.value)
    }
    return (
        <div ref={ref}>
            <div className="text-heading">Nộp bài</div>
            <div className="submit-info">
                <input className="text-input" placeholder="ID bài" type="text" />
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

            <button type="submit" className="btn-submit">Nộp bài</button>
        </div>
    )
}
export default Submit