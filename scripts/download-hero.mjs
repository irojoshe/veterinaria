#!/usr/bin/env node

/**
 * Descarga la imagen del Hero del archivo Figma usando su API.
 *
 * Uso:
 *   FIGMA_TOKEN=figd_... node scripts/download-hero.mjs
 *
 * El token se obtiene en Figma > Settings > Security > Personal access tokens
 * con scope file_content:read
 *
 * Guarda la imagen en public/images/hero-clinica.jpg (o .png si es PNG)
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const FIGMA_FILE_KEY = 'Uh2wHWugma4DwN8GIkJNbw'
const HERO_NODE_ID = '3:46478'
const FIGMA_TOKEN = process.env.FIGMA_TOKEN

if (!FIGMA_TOKEN) {
  console.error(
    'Error: FIGMA_TOKEN no está definido.\n' +
    'Obtén un token en Figma > Settings > Security > Personal access tokens\n' +
    'Luego ejecuta: FIGMA_TOKEN=figd_... node scripts/download-hero.mjs'
  )
  process.exit(1)
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`))
          return
        }

        const fileStream = fs.createWriteStream(filePath)
        response.pipe(fileStream)

        fileStream.on('finish', () => {
          fileStream.close()
          resolve()
        })

        fileStream.on('error', reject)
      })
      .on('error', reject)
  })
}

async function getImageUrl(nodeId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeId}&format=jpg`

    const req = https.request(url, {
      method: 'GET',
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    })

    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        if (data.err) {
          reject(new Error(`Figma API: ${data.err}`))
          return
        }
        const imageUrl = data.images?.[nodeId]
        if (!imageUrl) {
          reject(new Error('No image URL in Figma response'))
          return
        }
        resolve(imageUrl)
      } catch (e) {
        reject(e)
      }
    })

    req.on('error', reject)
  })
}

async function main() {
  try {
    console.log('Descargando imagen del Hero desde Figma...')
    const imageUrl = await getImageUrl(HERO_NODE_ID)
    console.log(`URL de imagen obtenida: ${imageUrl.slice(0, 60)}...`)

    const imagesDir = path.join(rootDir, 'public', 'images')
    fs.mkdirSync(imagesDir, { recursive: true })

    const ext = imageUrl.includes('png') ? '.png' : '.jpg'
    const filePath = path.join(imagesDir, `hero-clinica${ext}`)

    await downloadImage(imageUrl, filePath)

    console.log(`✓ Imagen guardada en ${filePath}`)

    if (ext === '.png') {
      console.log(
        '⚠ Imagen descargada como PNG. Considera convertirla a JPG para reducir tamaño.\n' +
        '  Si es necesario cambiar la extensión en HeroSection.tsx a .png'
      )
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
