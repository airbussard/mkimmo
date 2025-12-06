import Imap from 'imap'
import { simpleParser } from 'mailparser'
import type { Readable } from 'stream'
import type { EmailSettings } from '@/types/email'

export interface FetchedEmail {
  messageId?: string
  inReplyTo?: string
  from: {
    email: string
    name?: string
  }
  to: string
  subject: string
  contentHtml?: string
  contentText?: string
  date: Date
}

export async function fetchUnreadEmails(
  settings: EmailSettings
): Promise<FetchedEmail[]> {
  return new Promise((resolve, reject) => {
    const emails: FetchedEmail[] = []

    const imap = new Imap({
      user: settings.imapUser,
      password: settings.imapPassword,
      host: settings.imapHost,
      port: settings.imapPort,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 30000,
      authTimeout: 30000,
    })

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          imap.end()
          reject(err)
          return
        }

        imap.search(['UNSEEN'], (searchErr, results) => {
          if (searchErr) {
            imap.end()
            reject(searchErr)
            return
          }

          if (!results || results.length === 0) {
            console.log('[IMAP] No unread emails found')
            imap.end()
            resolve([])
            return
          }

          console.log(`[IMAP] Found ${results.length} unread emails`)

          const fetch = imap.fetch(results, {
            bodies: '',
            markSeen: true,
          })

          let pending = results.length

          fetch.on('message', (msg) => {
            msg.on('body', (stream: Readable) => {
              simpleParser(stream)
                .then((parsed) => {
                  const fromAddress = parsed.from?.value?.[0]
                  // Handle 'to' which can be AddressObject or AddressObject[]
                  const toField = parsed.to
                  const toAddress = Array.isArray(toField)
                    ? toField[0]?.value?.[0]
                    : toField?.value?.[0]

                  if (fromAddress && toAddress) {
                    emails.push({
                      messageId: parsed.messageId,
                      inReplyTo: parsed.inReplyTo,
                      from: {
                        email: fromAddress.address || '',
                        name: fromAddress.name,
                      },
                      to: toAddress.address || '',
                      subject: parsed.subject || '(Kein Betreff)',
                      contentHtml: sanitizeHtml(parsed.html || ''),
                      contentText: parsed.text,
                      date: parsed.date || new Date(),
                    })
                  }

                  pending--
                  if (pending === 0) {
                    imap.end()
                    resolve(emails)
                  }
                })
                .catch((parseErr) => {
                  console.error('[IMAP] Parse error:', parseErr)
                  pending--
                  if (pending === 0) {
                    imap.end()
                    resolve(emails)
                  }
                })
            })
          })

          fetch.once('error', (fetchErr) => {
            console.error('[IMAP] Fetch error:', fetchErr)
            imap.end()
            reject(fetchErr)
          })

          fetch.once('end', () => {
            console.log('[IMAP] Fetch completed')
          })
        })
      })
    })

    imap.once('error', (err: Error) => {
      console.error('[IMAP] Connection error:', err)
      reject(err)
    })

    imap.once('end', () => {
      console.log('[IMAP] Connection ended')
    })

    imap.connect()
  })
}

export async function testImapConnection(settings: EmailSettings): Promise<{
  success: boolean
  error?: string
}> {
  return new Promise((resolve) => {
    const imap = new Imap({
      user: settings.imapUser,
      password: settings.imapPassword,
      host: settings.imapHost,
      port: settings.imapPort,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 10000,
      authTimeout: 10000,
    })

    imap.once('ready', () => {
      imap.end()
      resolve({ success: true })
    })

    imap.once('error', (err: Error) => {
      resolve({ success: false, error: err.message })
    })

    imap.connect()
  })
}

// Extrahiert Anfrage-ID aus Subject: [ANFRAGE-uuid]
export function extractRequestIdFromSubject(subject: string): string | null {
  const match = subject.match(/\[ANFRAGE-([a-f0-9-]+)\]/i)
  return match ? match[1] : null
}

// Sanitize HTML content
function sanitizeHtml(html: string): string {
  if (!html) return ''

  return html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove forms
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    // Remove iframes
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}
