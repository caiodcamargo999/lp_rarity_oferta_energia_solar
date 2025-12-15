import { NextResponse } from 'next/server'

export async function GET() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY || ''

  return NextResponse.json({
    hasKey: !!privateKey,
    keyLength: privateKey.length,
    startsWithQuote: privateKey.startsWith('"'),
    endsWithQuote: privateKey.endsWith('"'),
    startsWithDashes: privateKey.startsWith('-----BEGIN'),
    firstChars: privateKey.substring(0, 30),
    lastChars: privateKey.substring(privateKey.length - 30),
    hasLiteralBackslashN: privateKey.includes('\\n'),
    hasRealNewline: privateKey.includes('\n'),
    afterReplace: {
      length: privateKey.replace(/\\n/g, '\n').length,
      startsWithDashes: privateKey.replace(/\\n/g, '\n').startsWith('-----BEGIN'),
      firstChars: privateKey.replace(/\\n/g, '\n').substring(0, 30)
    }
  })
}
