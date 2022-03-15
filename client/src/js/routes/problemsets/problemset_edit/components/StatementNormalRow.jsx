import MarkdownPreview from '@uiw/react-markdown-preview'
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'react-markdown-editor-lite/lib/index.css'
import 'katex/dist/katex.min.css'

MdEditor.use(Plugins.TabInsert, { tabMapValue: 1 });

function StatementNormalRow(props) {
    return (
        <div className='flex-vertical'>
            <div>{props.title}</div>
            <MdEditor
                style={{ height: props.height, overflow: "hidden" }}
                renderHTML={(text) => <MarkdownPreview remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} source={text} />}
            />
        </div>
    )
}
export default StatementNormalRow