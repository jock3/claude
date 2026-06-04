Run the UI/UX Pro Max design intelligence skill for the following request:

$ARGUMENTS

## Workflow

1. **Analyze** the request — extract product type, style keywords, industry, and stack (default: the current project's stack if known, otherwise html-tailwind).

2. **Generate design system** — always run this first:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <keywords>" --design-system -p "<Project Name>"
```

3. **Supplement** with domain searches as needed:
```bash
# UX/animation guidelines
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain ux

# Style options
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain style

# Color palettes
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain color

# Typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain typography
```

4. **Stack guidelines** — get implementation specifics for the current stack:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack react
```

5. **Implement** — apply the design system to the code. Run the pre-delivery checklist before finishing:
- [ ] No emojis as icons (use SVG: Lucide/Heroicons)
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Light mode text contrast ≥ 4.5:1
- [ ] Focus states visible for keyboard nav
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
