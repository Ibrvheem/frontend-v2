# Qoollege Design Rules

The UI is the product. These rules are not suggestions. If a screen breaks one, fix the screen, not the rule.
If a rule is genuinely wrong, change it here first, then change the code.

## 1. The feel

**Calm and clean.** Students and parents come here stressed about college. The app should feel quiet, clear and in control.

- Lots of white space. When in doubt, add space, remove a border.
- One strong colour (brand blue). Everything else is neutral.
- One job per screen. One primary button per screen.
- Content first. No decoration that doesn't help someone understand or act.

## 2. Colour

Only use tokens. Never raw Tailwind colours (`bg-blue-500`, `text-gray-600`) and never hex in components.

| Token | Use it for |
|---|---|
| `primary` (#057dcd) | Primary buttons, active nav, focus rings, key highlights |
| `primary-text` (darker blue) | Links and small blue text (keeps contrast readable) |
| `background` | Page background (off-white) |
| `card` | Cards, panels, popovers (white) |
| `foreground` | Main text (near-black, not pure black) |
| `muted-foreground` | Secondary text, labels, hints |
| `border` | All borders and dividers (one light grey) |
| `success` / `warning` / `danger` / `info` | Status only: badges, alerts, form errors. Never decoration. |

Rules:
- Blue is earned. If everything is blue, nothing is. Max one filled blue button per screen.
- Status colours come as a pair: soft background + strong text, e.g. `bg-success/10 text-success`.
- No gradients, no glows, no coloured shadows.
- Light mode first. Every colour is a token so dark mode can be added later without touching components.

## 3. Type

- **Inter, and only Inter**, for the whole app. No second display font, no per-page fonts.
- A fixed scale. Only these sizes:

| Role | Class | Weight |
|---|---|---|
| Page title | `text-2xl` | semibold |
| Section title | `text-lg` | semibold |
| Body | `text-sm` (14px) | normal |
| Small / labels | `text-xs` (12px) | medium |
| Big numbers (stats) | `text-3xl` | semibold, `tabular-nums` |

- Max 2 weights on a screen (normal + semibold). No bold, no light.
- Sentence case everywhere: "Add a task", not "Add A Task". No ALL CAPS except tiny labels.
- Line length max ~70 characters for reading text (`max-w-prose`).

## 4. Spacing and layout

- 4px grid. Use Tailwind spacing steps only: 1, 2, 3, 4, 6, 8, 12, 16. No arbitrary values like `p-[13px]`.
- Page padding: `p-6` desktop, `p-4` mobile.
- Space between sections: `gap-8`. Inside a card: `p-6`, items `gap-4`.
- Content width: pages max `max-w-6xl`, forms max `max-w-lg`.
- Every screen works at 375px wide. Mobile is not an afterthought; parents use phones.

## 5. Shape and depth

- Radius: `rounded-lg` (8px) for cards, dialogs, buttons and inputs. `rounded-md` (6px) for small bits like badges and menu items. Nothing else. No pills, no `rounded-full` except avatars.
- Buttons and inputs are 40px tall (`h-10`) by default.
- Separate things with space first, a border second, a shadow last.
- Shadows only on things that float: dropdowns, popovers, dialogs (`shadow-lg`). Cards are flat with a border.

## 6. Components

- Build from `components/ui` (shadcn). Never restyle a component inline to make it look different. If a variant is missing, add it to the component.
- Buttons: `default` (blue, one per screen), `outline` (secondary actions), `ghost` (tertiary, toolbars), `destructive` (only for delete). Labels are verbs: "Save changes", "Add task".
- Forms: label above input, hint below in `muted-foreground`, error below in `danger`. Never placeholder-as-label.
- **No icons by default.** Use text labels. An icon is only added when Ibrahim has approved that specific icon in that specific place. When approved: lucide only, `size-4` inline, `size-5` standalone, always with a text label or `aria-label`.
- Tables for data people compare; cards for things people act on.

## 7. Every state is designed

A screen is not done until all of these look intentional:
- **Loading**: a `Skeleton` that matches the real layout. Never a blank screen, never a lone spinner for page content.
- **Empty**: a short sentence saying what goes here + the one action to fill it.
- **Error**: what went wrong in plain words + what to do next. Never a raw error message or code.
- **Success**: a toast for small actions; a clear confirmation screen for big ones (payments, submissions).

## 8. Words

- Plain, short, friendly. Write like a helpful counsellor, not a system.
- No emojis anywhere in the UI.
- No em dashes in copy. Use a full stop or a comma.
- Name things by what they do for the user, not by our internal names.
- Important warnings are visible (alert component), never buried in grey small print.

## 9. Motion

- Motion explains, it doesn't decorate. Use it for things appearing, moving or changing state.
- Short: 150–200ms for UI feedback, max 300ms for larger transitions. Ease-out.
- No bouncing, no looping animations, no parallax.
- Respect `prefers-reduced-motion`.

## 10. Accessibility (non-negotiable)

- Text contrast at least 4.5:1. That's why small blue text uses `primary-text`, not `primary`.
- Everything works with a keyboard, with a visible focus ring (`ring-primary`).
- Click targets at least 40px tall.
- Every input has a label, every icon-only button has an `aria-label`, every image has `alt`.

## Banned

- Raw colours, hex values or arbitrary values in components
- Any font other than Inter
- Icons that haven't been explicitly approved
- Gradients, glows, coloured shadows, glassmorphism
- Emojis and em dashes in copy
- `useEffect` for data fetching
- A screen without loading, empty and error states
- Two filled blue buttons on the same screen
