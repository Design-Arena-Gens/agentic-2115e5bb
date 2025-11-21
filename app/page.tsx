'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Workflow, Brain, Zap, Lightbulb, ArrowRight } from 'lucide-react'

interface Module {
  name: string
  description: string
  hasAI: boolean
}

interface Scenario {
  title: string
  description: string
  modules: Module[]
  aiIntegration: string
  tips: string[]
}

export default function Home() {
  const [input, setInput] = useState('')
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const examples = [
    {
      title: "Assistant Email Intelligent",
      description: "Triez et répondez automatiquement aux emails avec IA"
    },
    {
      title: "Veille Concurrentielle",
      description: "Surveillez vos concurrents et générez des rapports d'analyse"
    },
    {
      title: "Gestionnaire de Support Client",
      description: "Analysez les tickets et proposez des solutions automatiques"
    },
    {
      title: "Générateur de Contenu Social",
      description: "Créez et planifiez du contenu sur les réseaux sociaux"
    },
    {
      title: "Extracteur de Factures",
      description: "Lisez les factures PDF et extrayez les données avec OCR + IA"
    },
    {
      title: "Qualificateur de Leads",
      description: "Analysez et notez automatiquement vos prospects"
    }
  ]

  const generateScenario = async () => {
    if (!input.trim()) {
      setError('Veuillez décrire votre idée ou problème')
      return
    }

    setLoading(true)
    setError('')
    setScenario(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      setScenario(data.scenario)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example: typeof examples[0]) => {
    setInput(example.description)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🤖 Architecte Make AI</h1>
        <p>Transformez vos idées en scénarios Make intelligents avec IA intégrée</p>
      </header>

      <main>
        <div className="main-card">
          <div className="input-section">
            <label htmlFor="input">
              Décrivez votre idée ou problème d'automatisation
            </label>
            <textarea
              id="input"
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Exemple : Je veux automatiser la réponse aux emails de support client en analysant le contenu et en proposant des réponses adaptées..."
            />
          </div>

          <button
            className="button"
            onClick={generateScenario}
            disabled={loading}
          >
            {loading ? (
              <span className="loading">
                <Loader2 className="spinner" size={20} />
                Génération en cours...
              </span>
            ) : (
              <span className="loading">
                <Sparkles size={20} />
                Générer le Scénario
              </span>
            )}
          </button>

          {error && (
            <div className="error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}
        </div>

        {scenario && (
          <div className="result-section">
            <div className="scenario-card">
              <div className="scenario-header">
                <div className="scenario-icon">
                  <Workflow size={24} />
                </div>
                <div className="scenario-title">
                  <h2>{scenario.title}</h2>
                  <p>{scenario.description}</p>
                </div>
              </div>

              <div className="section">
                <h3>
                  <Brain size={20} />
                  Modules du Scénario
                </h3>
                <div className="modules-list">
                  {scenario.modules.map((module, index) => (
                    <div key={index} className="module-item">
                      <div className="module-header">
                        <div className="module-number">{index + 1}</div>
                        <div className="module-title">
                          {module.name}
                          {module.hasAI && (
                            <span className="ai-badge">
                              <Sparkles size={12} />
                              IA
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="module-description">
                        {module.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3>
                  <Zap size={20} />
                  Intégration de l'IA
                </h3>
                <div className="section-content">
                  {scenario.aiIntegration}
                </div>
              </div>

              <div className="section">
                <h3>
                  <Lightbulb size={20} />
                  Conseils de Mise en Œuvre
                </h3>
                <ul className="tips-list">
                  {scenario.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!scenario && !loading && (
          <div className="examples">
            <h2>Exemples d'Automatisations</h2>
            <div className="example-grid">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="example-card"
                  onClick={() => handleExampleClick(example)}
                >
                  <h3>{example.title}</h3>
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
