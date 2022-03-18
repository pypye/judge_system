import MarkdownPreview from '@uiw/react-markdown-preview'
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'react-markdown-editor-lite/lib/index.css'
import 'katex/dist/katex.min.css'
import React from 'react'
import { ProblemsetInfoContext } from '../../../../context'

MdEditor.use(Plugins.TabInsert, { tabMapValue: 1 });

function MarkdownArea(props) {
    const { info, setInfo } = React.useContext(ProblemsetInfoContext)

    const onInfoChange = (type, value) => {
        const items = { ...info }
        items[type] = value
        setInfo(items)
    }

    return (
        <div className='flex-vertical'>
            <div>{props.title}</div>
            <MdEditor
                style={{ height: props.height, overflow: "hidden" }}
                renderHTML={(text) => <MarkdownPreview remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} source={text} />}
                onChange={({html, text}) => {onInfoChange(props.type, text)}}
            />
        </div>
    )
}
export default MarkdownArea