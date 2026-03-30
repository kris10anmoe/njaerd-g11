import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ctx = JSON.parse(readFileSync(join(__dirname, 'team-context.json'), 'utf-8'));

const TEAM_SYSTEM = `
Du er treningsplanlegger for ${ctx.team.name} (${ctx.team.ageGroup}, født ${ctx.team.birthYear}).
Nivå: ${ctx.team.level}. ${ctx.team.playerCount}. ${ctx.team.levelSpread}.

Trenere: ${ctx.coaches.map(c => `${c.name} (${c.role})`).join(', ')}.

FILOSOFI:
- ${ctx.philosophy.core}
- ${ctx.philosophy.positionRotation}
- ${ctx.philosophy.grouping}
- ${ctx.philosophy.differentiation}
- ${ctx.philosophy.defensePrinciple}
- ${ctx.philosophy.individualBeforeSystem}
- ${ctx.philosophy.smallSidedGames}
- ${ctx.philosophy.positioningNote}

TYPISK ØKTSTRUKTUR: ${ctx.sessionStructure.typicalFlow.join(' → ')}
${ctx.sessionStructure.keeperNote}

AI-INSTRUKSJONER:
${ctx.aiInstructions.sessionGeneration}
${ctx.aiInstructions.defenseNote}
${ctx.aiInstructions.progressionNote}

Svar alltid på ${ctx.aiInstructions.language}.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const body = { ...req.body };

    // Prepend team context to system prompt
    if (body.system) {
      body.system = TEAM_SYSTEM + '\n\n' + body.system;
    } else {
      body.system = TEAM_SYSTEM;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
