import React from "react"
import MarkdownPreview from '@uiw/react-markdown-preview'
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'react-markdown-editor-lite/lib/index.css'
import 'katex/dist/katex.min.css'

function CreatePost() {

    return <React.Fragment>
        <div className="text-heading">Create post</div>
        <MdEditor
            style={{ height: '350px', overflow: "hidden" }}
            renderHTML={(text) => <MarkdownPreview remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} source={text} />}
            name=''
        />
        <button className="btn-submit">Create</button>
    </React.Fragment>
} export default CreatePost