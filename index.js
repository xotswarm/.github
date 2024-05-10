import {readSync, writeSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'

import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkRetext from 'remark-retext'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'

const retextProc = unified()
  .use(retextEnglish)
  .use(retextIndefiniteArticle)

const remarkProc = unified()
  .use(remarkParse)
  .use(remarkRetext, retextProc)
  .use(remarkSlug)
  .use(remarkToc)
  .use(remarkRehype)

const rehypeProc = remarkProc
  .use(rehypeDocument, {title: 'Contents'})
  .use(rehypeStringify)

rehypeProc
  .process(readSync('profile/readme.md'))
  .then(
    (file) => {
      console.error(reporter(file))
      file.extname = '.html'
      writeSync(file)
    },
    (error) => {
      throw error
    }
  )
