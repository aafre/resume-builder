/**
 * Shows the real, unedited Claude output for one prompt on /blog/claude-resume-prompts.
 * Data comes from bench/run_claude_prompts.py; never hand-edit claudePromptRuns.json.
 */
import runs from '../../data/claudePromptRuns.json';

type Run = { n: number; title: string; prompt: string; output: string; model: string; ran_utc: string };
const RESULTS = runs.results as Run[];
const BY_N = new Map(RESULTS.map((r) => [r.n, r]));

export default function ClaudePromptRun({ n }: { n: number }) {
  const run = BY_N.get(n);
  if (!run) return null;
  return (
    <details className="mt-3 rounded-xl border border-black/[0.06] bg-white">
      <summary className="cursor-pointer px-5 py-3 font-medium text-accent-text min-h-11 flex items-center">
        See Claude&apos;s real output for prompt #{n}
      </summary>
      <div className="px-5 pb-5 text-sm text-ink/80 leading-relaxed space-y-4">
        <p className="text-xs text-ink/60">
          {run.model} · run {run.ran_utc} · unedited · sample candidate, not a real person
        </p>
        <div>
          <p className="font-bold text-ink mb-1">What we sent</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink bg-chalk-dark rounded-lg p-3">{run.prompt}</pre>
        </div>
        <div>
          <p className="font-bold text-ink mb-1">What Claude returned (raw markdown)</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink bg-chalk-dark rounded-lg p-3">{run.output}</pre>
        </div>
      </div>
    </details>
  );
}
