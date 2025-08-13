import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  
  try {
    console.log('Attempting to read file from:', slug)
    const coursePath = join(process.cwd(), 'app/[locale]/(dashboard)/(route)/aideveloper', `${slug}/index.mdx`)
    console.log('Full path:', coursePath)
    
    const source = readFileSync(coursePath, 'utf8')
    console.log('File content loaded:', source.substring(0, 100)) // 只打印前100个字符
    
    const { data: frontmatter, content } = matter(source)
    console.log('Parsed frontmatter:', frontmatter)
    
    const mdxSource = await serialize(content)
    console.log('Serialized content length:', mdxSource.length)
    
    return NextResponse.json({ 
      frontmatter, 
      content: mdxSource 
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('File reading error:', error)
    return NextResponse.json({ 
      error: 'Failed to load lesson',
      details: error.message,
      path: error.path
    }, { 
      status: 404 
    })
  }
}