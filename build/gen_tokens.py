"""Regenerate tokens-v2/tokens.{css,json} from a neeto-atoms checkout (reads origin/main src/index.css)."""
import re, json, sys, subprocess
src = subprocess.run(["git","-C",sys.argv[1],"show","origin/main:src/index.css"],capture_output=True,text=True,check=True).stdout
ver = json.loads(subprocess.run(["git","-C",sys.argv[1],"show","origin/main:package.json"],capture_output=True,text=True,check=True).stdout)["version"]
def block(sel):
    m = re.search(re.escape(sel) + r"\s*\{(.*?)\n\}", src, re.S)
    body = m.group(1)
    return body
light = block(":root,\n.light"); dark = block(".dark")
def strip(b):  # keep declarations + comments, normalize indent
    return "\n".join("  " + l.strip() for l in b.strip("\n").splitlines() if l.strip())
css = f"""/**
 * neeto-atoms design tokens — copied verbatim from @bigbinary/neeto-atoms@{ver} src/index.css.
 * Semantic OKLCH tokens; `.dark` swaps the palette, `.light` opts a subtree back into light.
 * primary = brand green (#480). Black survives only as --neutral-solid (the `neutral` button).
 * Font: "Geist Variable". UI default 14px/400 (Tailwind text-sm, line-height 20px).
 * Regenerate: python3 build/gen_tokens.py <neeto-atoms checkout> tokens-v2/tokens.css tokens-v2/tokens.json (reads origin/main).
 */
:root,
.light {{
{strip(light)}
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
}}

.dark {{
{strip(dark)}
}}
"""
def decls(b):
    return {k[2:]: v.strip() for k, v in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", b)}
tj = {"name": "neeto-atoms (Neeto Design System V2)", "source": f"@bigbinary/neeto-atoms@{ver} src/index.css",
      "font": {"family": "Geist Variable, ui-sans-serif, system-ui, sans-serif", "uiDefault": "14px/400/20px",
               "weights": {"body": 400, "medium": 500, "heading": 600}},
      "radius": {"base": "10px", "sm": "6px", "md": "8px", "lg": "10px", "xl": "14px", "full": "999px"},
      "light": decls(light), "dark": decls(dark)}
open(sys.argv[2], "w").write(css)
open(sys.argv[3], "w").write(json.dumps(tj, indent=2) + "\n")
print(ver, len(tj["light"]), "light /", len(tj["dark"]), "dark tokens")
