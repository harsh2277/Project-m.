import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import https from 'https'
import http from 'http'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

/**
 * Vite plugin: dynamic Jira reverse-proxy.
 *
 * The browser sends requests to  /jira-proxy/<path>
 * with an  X-Jira-Target  header containing the base Jira URL.
 * The plugin's dev-server middleware forwards the request to
 * <X-Jira-Target>/<path> using Node's built-in https module,
 * so CORS never applies (it's a server-to-server call).
 *
 * Only active during `vite dev` — the production build doesn't
 * include this code at all.
 */
function jiraProxyPlugin(): Plugin {
  return {
    name: 'jira-proxy',
    configureServer(server) {
      server.middlewares.use('/jira-proxy', (req: IncomingMessage, res: ServerResponse) => {
        // Preflight CORS for the browser
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        if (req.method === 'OPTIONS') {
          res.writeHead(204)
          res.end()
          return
        }

        const targetBase = req.headers['x-jira-target'] as string | undefined
        if (!targetBase) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing X-Jira-Target header' }))
          return
        }

        const apiPath = req.url ?? '/'
        let target: URL
        try {
          target = new URL(apiPath, targetBase)
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: `Invalid target URL: ${targetBase}${apiPath}` }))
          return
        }

        const isHttps = target.protocol === 'https:'
        const client = (isHttps ? https : http) as typeof https

        // Forward all request headers except ones that would confuse the target
        const forwardHeaders: Record<string, string | string[]> = {}
        for (const [key, value] of Object.entries(req.headers)) {
          if (['host', 'origin', 'referer', 'x-jira-target'].includes(key)) continue
          if (value !== undefined) forwardHeaders[key] = value as string | string[]
        }

        const options: https.RequestOptions = {
          hostname: target.hostname,
          port: target.port || (isHttps ? 443 : 80),
          path: target.pathname + target.search,
          method: req.method ?? 'GET',
          headers: {
            ...forwardHeaders,
            host: target.hostname,
          },
        }

        const proxyReq = client.request(options, (proxyRes) => {
          const statusCode = proxyRes.statusCode ?? 200
          // Strip hop-by-hop response headers
          const responseHeaders: Record<string, string | string[]> = {}
          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (['transfer-encoding', 'connection'].includes(key)) continue
            if (value !== undefined) responseHeaders[key] = value
          }
          responseHeaders['access-control-allow-origin'] = '*'
          res.writeHead(statusCode, responseHeaders)
          proxyRes.pipe(res)
        })

        proxyReq.on('error', (err) => {
          console.error('[jira-proxy] error:', err.message)
          if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          }
        })

        req.pipe(proxyReq)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    jiraProxyPlugin(),
  ],
  server: {
    port: 3000,
    allowedHosts: [
      'express-frantic-impurity.ngrok-free.dev'
    ]
  }
})
