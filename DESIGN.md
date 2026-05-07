# Forest Road Design System

## Brand & Style

The design system is rooted in the "Allemansrätten" (freedom to roam) spirit—balancing professional communal management with the organic beauty of the Swedish landscape. It targets residents, local authorities, and contractors, demanding a UI that feels as sturdy as a gravel road and as serene as a pine forest.

The style is **Modern Minimalism with Tactile influences**. It prioritizes clarity and breathability, using generous whitespace to evoke the openness of the countryside.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1B3022` | Footer, headings, heavy UI |
| `secondary` | `#2D5A27` | Primary buttons, active states |
| `surface` | `#F9F7F2` | Background (warm sand) |
| `surface-container` | `#F0EEE9` | Cards background |
| `surface-container-highest` | `#E4E2DD` | Borders, dividers |
| `on-surface` | `#1B1C19` | Body text |
| `on-surface-variant` | `#434843` | Secondary text |
| `error` | `#BA1A1A` | Error states |
| `outline` | `#737973` | Borders, icons |
| `outline-variant` | `#C3C8C1` | Subtle borders |
| `tertiary` | `#8C7355` | Earth accent |

## Typography

**Font:** Manrope (Google Fonts)

| Level | Size | Weight | Line-height | Letter-spacing |
|-------|------|--------|-------------|----------------|
| h1 | 40px | 700 | 1.2 | -0.02em |
| h2 | 32px | 600 | 1.3 | -0.01em |
| h3 | 24px | 600 | 1.4 | — |
| body-lg | 18px | 400 | 1.6 | — |
| body-md | 16px | 400 | 1.6 | — |
| button | 16px | 600 | 1.0 | — |
| label-caps | 12px | 700 | 1.0 | 0.05em |

## Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| base | 8px |
| sm | 12px |
| md | 24px |
| lg | 48px |
| xl | 80px |
| gutter | 24px |
| container-max | 1200px |

## Shapes

- **Buttons/Inputs:** 10px radius (0.625rem)
- **Cards:** 12-16px radius
- **No sharp 90° corners** — organic, welcoming feel

## Elevation

- **Level 0 (Surface):** Sand background `#F9F7F2`
- **Level 1 (Cards):** White `#FFFFFF` with 1px soft-grey border and subtle shadow
- **Level 2 (Modals):** Deeper "forest shadows" — green-tinted, low opacity

## Components

### Buttons
- **Primary:** Solid `#2D5A27` (Moss) with white text, rounded 10px
- **Outlined:** Transparent, 2px border `#1B3022`, for secondary actions

### Cards
- White background, 1px soft-grey border, 12-16px rounded corners
- Minimum 24px padding inside

### Inputs
- Cream-white background, 1px border
- Focus: 2px Moss green ring

### Footer
- Solid `#1B3022` background with white/light-sand text
- Grounding, "heavy base" feel

### Status Chips
- Pill-shaped, low-saturation colors (Moss for success, Earth-brown for warnings)

## Design System Notes for Stitch Generation

When generating new screens, always include:

```
**DESIGN SYSTEM (REQUIRED):**
Font: Manrope (Google Fonts). Colors: primary #1B3022, secondary #2D5A27, surface #F9F7F2, on-surface #1B1C19. Rounded corners: 10px buttons, 12-16px cards. Spacing: 8px base scale (4,8,12,24,48,80). Style: Scandinavian forest aesthetic, warm and professional, generous whitespace.
```