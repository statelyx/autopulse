# Design System Specification: The Kinetic Obsidian Framework

## 1. Overview & Creative North Star: "The Digital Cockpit"
The Creative North Star for this design system is **"The Digital Cockpit."** We are not building a website; we are engineering a high-performance instrument cluster. This system rejects the "template" aesthetic of the modern web in favor of an editorial, cinematic experience that feels like the dashboard of a luxury electric grand tourer.

To achieve this, we move beyond rigid, centered grids. We embrace **Intentional Asymmetry**—where heavy, high-contrast typography anchors one side of the frame while "Electric Cyan" data visualizations float in expansive negative space. We utilize overlapping elements and "Light Leaks" to create a sense of depth that feels physical, not digital.

---

## 2. Colors: The Depth of Shadow
The palette is rooted in the absence of light, using `surface_container_lowest` (#0e0e0e) and `surface` (#131313) to create a void that makes our accents vibrate with energy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional "boxing" kills the premium feel. Boundaries must be defined through background color shifts.
*   *Example:* A `surface_container_low` (#1c1b1b) hero section should sit directly against a `surface` (#131313) body without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, machined layers. 
*   **Base:** `background` (#131313)
*   **Primary Containers:** `surface_container` (#201f1f)
*   **Elevated Details:** `surface_container_highest` (#353534)
By nesting a `surface_container_high` card inside a `surface_container_low` section, you create a "recessed" or "extruded" look that feels engineered rather than drawn.

### The "Glass & Gradient" Rule
To evoke automotive glass, use `surface_variant` at 40% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** Apply a linear gradient (45deg) from `primary` (#ffd597) to `primary_container` (#ffb000) for high-impact CTAs. This creates a "metallic" luster that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We pair the technical precision of **Inter** with the aggressive, wide stance of **Space Grotesk** to mirror the typography found in high-end automotive brochures.

*   **Display & Headlines (Space Grotesk):** Use `display-lg` and `headline-lg` for data-heavy headers. These should be set with tight letter-spacing (-0.02em) to feel "heavy" and authoritative.
*   **Body & Labels (Inter):** All functional text uses Inter. Use `label-md` for technical metadata, always in uppercase with increased letter-spacing (+0.05em) to mimic telemetry readouts.
*   **Contrast as Hierarchy:** Pair a `display-lg` headline in `on_surface` with a `body-sm` description in `on_surface_variant`. The extreme scale difference creates a premium, editorial "editorial" rhythm.

---

## 4. Elevation & Depth: Tonal Layering
In this system, light comes from the components themselves, not an external source.

*   **The Layering Principle:** Use the spacing scale (e.g., `spacing.8`) to create breathing room between containers of different surface tiers. The "lift" is perceived by the color shift, not a drop shadow.
*   **Ambient Shadows:** If an element must float (like a modal), use a shadow with a 64px blur at 8% opacity, using the `primary_fixed` color as the shadow tint. This simulates a "cinematic glow" rather than a dirty grey shadow.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use `outline_variant` (#524533) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use `secondary_container` (#00eefc) at 5% opacity for backgrounds of active technical panels to create a "heads-up display" (HUD) effect.

---

## 5. Components: Machined Precision

### Buttons
*   **Primary:** Background `primary_container` (#ffb000), text `on_primary_fixed` (#281800), `rounded-md`. No border.
*   **Secondary (The HUD Button):** Transparent background, `ghost border` (outline-variant at 20%), text `primary`. On hover, add a 2px inner glow of `primary`.
*   **Tertiary:** Text `secondary` (#d3fbff) with an underline offset by `spacing.1.5`.

### Input Fields
*   **State:** Background should be `surface_container_lowest`. 
*   **Focus:** Do not use a blue ring. Change the background to `surface_container_highest` and add a 1px `primary` bottom-border only.

### Cards & Lists
*   **Constraint:** Forbid divider lines. Use `spacing.4` to separate list items. 
*   **Interaction:** On hover, a card should transition its background from `surface_container` to `surface_container_high`.

### Specialized Components (Automotive Context)
*   **The Telemetry Chip:** A small, `surface_container_highest` pill with a `secondary` (Electric Cyan) dot to indicate "Live" data streaming.
*   **Glow Triggers:** Use a 40px radial gradient of `primary` at 10% opacity behind icon buttons to simulate backlighting.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Push content to the edges to create a cinematic widescreen feel.
*   **Do** use the full range of the spacing scale. Premium design requires "expensive" air—large gaps of `spacing.24` between major sections.
*   **Do** use `secondary_fixed_dim` (#00dbe9) for all success/positive data trends to keep the "Electric Cyan" tech-vibe consistent.

### Don't:
*   **Don't** use pure white (#FFFFFF). It breaks the dark-room immersion. Use `on_surface` (#e5e2e1) for maximum brightness.
*   **Don't** use standard `rounded-full` for buttons unless they are icons. Stick to `rounded-md` (0.375rem) to maintain a "machined" architectural edge.
*   **Don't** use 100% opaque borders. They create visual noise and make the UI look like a legacy "enterprise" dashboard.