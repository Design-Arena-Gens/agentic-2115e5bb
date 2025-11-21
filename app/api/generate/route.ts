import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input invalide' },
        { status: 400 }
      )
    }

    const prompt = `Tu es un Architecte expert en automatisation sur Make.com avec une spécialité unique : intégrer de l'Intelligence Artificielle au cœur des scénarios.

Mission : Concevoir un scénario Make complet et intelligent pour résoudre ce besoin :
"${input}"

Instructions :
- Propose un scénario Make avec modules précis et réalistes
- Intègre OBLIGATOIREMENT de l'IA (OpenAI, Claude, ou autre) dans au moins 2-3 modules clés
- Sois créatif, flexible et inventif
- Ne t'enferme pas dans des règles techniques strictes
- Pense "comment l'IA peut rendre ce scénario vraiment intelligent"

Réponds UNIQUEMENT avec un JSON valide dans ce format exact (sans markdown, sans backticks) :
{
  "title": "Titre du scénario",
  "description": "Description courte et claire",
  "modules": [
    {
      "name": "Nom du module Make",
      "description": "Ce que fait ce module",
      "hasAI": true/false
    }
  ],
  "aiIntegration": "Explication détaillée de comment l'IA est utilisée dans ce scénario",
  "tips": [
    "Conseil pratique 1",
    "Conseil pratique 2",
    "Conseil pratique 3"
  ]
}

IMPORTANT : Ta réponse doit être un JSON pur, sans texte avant ou après, sans \`\`\`json ou \`\`\`.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Nettoyer le JSON si nécessaire
    let cleanedResponse = responseText.trim()
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '')
    }

    const scenario = JSON.parse(cleanedResponse)

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error('Error generating scenario:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du scénario' },
      { status: 500 }
    )
  }
}
