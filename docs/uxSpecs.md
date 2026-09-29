# UX Design Specifications — Google Photos AI Memory Context MVP
## Document Reference: `docs/uxSpecs.md`

---

### 1. Executive Summary & Design Principles

The AI Memory Context experience extends the Google Photos application by seamlessly prompting users to capture personal stories, emotions, and anecdotes behind their photos, and using those memories to power natural language search.

#### Core Design Principles
1. **Unobtrusive & Timely:** Never interrupt active user browsing. Prompts appear natively as subtle cards in the "For You" / Memories carousel.
2. **Effortless Input:** Zero friction. Offer one-tap audio dictation alongside rich text typing, with live visual feedback.
3. **Transparent AI:** The user always maintains ownership and visibility. Clearly show what the AI extracted with instant editability.
4. **Delightful Micro-interactions:** Fluid Material 3 motion, tactile haptics, and responsive audio visualizers that make memory capture feel reflective and rewarding.

---

### 2. Design Tokens (Material 3 Theme)

#### 2.1 Color Palette
```css
:root {
  /* Google Photos Primary & Accents */
  --md-sys-color-primary: #1A73E8;            /* Google Blue */
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #D2E3FC;
  --md-sys-color-on-primary-container: #041E49;

  /* Surface & Background */
  --md-sys-color-surface: #FFFFFF;
  --md-sys-color-surface-dim: #F8F9FA;
  --md-sys-color-surface-container: #F1F3F4;
  --md-sys-color-surface-container-high: #E8EAED;
  --md-sys-color-on-surface: #202124;
  --md-sys-color-on-surface-variant: #5F6368;

  /* AI Accent (Gemini Sparkle Gradient) */
  --ai-sparkle-start: #4285F4;                 /* Google Blue */
  --ai-sparkle-mid: #9C27B0;                   /* Purple */
  --ai-sparkle-end: #EA4335;                   /* Warm Red */
  --ai-container-bg: #F0F4F9;
  --ai-glow-shadow: 0 4px 20px rgba(66, 133, 244, 0.18);

  /* Semantic Feedback */
  --md-sys-color-error: #D93025;
  --md-sys-color-success: #1E8E3E;
  --md-sys-color-warning: #F9AB00;

  /* Dark Mode Variants */
  --dark-surface: #202124;
  --dark-surface-container: #303134;
  --dark-on-surface: #E8EAED;
  --dark-ai-container-bg: #282A2D;
}
```

#### 2.2 Typography (Google Sans / Roboto)
* **Display Small:** 36px / Line Height: 44px / Regular
* **Headline Medium:** 24px / Line Height: 32px / Medium
* **Title Medium:** 16px / Line Height: 24px / Medium (Font Weight 500)
* **Body Large:** 16px / Line Height: 24px / Regular (Font Weight 400)
* **Body Medium:** 14px / Line Height: 20px / Regular
* **Label Medium:** 12px / Line Height: 16px / Medium (Font Weight 500)

#### 2.3 Shapes & Elevations
* **Card Corner Radius:** 24dp (Large shape)
* **Modal Bottom Sheet Radius:** Top corners 28dp
* **Chip Radius:** 8dp
* **Elevation 1 (Cards):** `0px 1px 3px rgba(60,64,67, 0.3), 0px 4px 8px 3px rgba(60,64,67, 0.15)`
* **Elevation 3 (Bottom Sheet):** `0px 8px 12px 6px rgba(60,64,67, 0.15), 0px 4px 4px rgba(60,64,67, 0.3)`

---

### 3. Screen Specifications & ASCII Wireframes

#### Flow 1: Context Prompt Card (In-Feed & Carousel)
Appears embedded in the Google Photos Home Timeline or Memories header.

```text
+-------------------------------------------------------------+
|  [Google Photos Header]      [Search Bar]      (Avatar)      |
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  | [✨ Memory Prompt]                        [X Dismiss]  |  |
|  |                                                       |  |
|  |  +----------------+  Trip to Lake Tahoe               |  |
|  |  |  Photo 1 (Cover)|  July 14–16, 2026 • 24 photos     |  |
|  |  |  [Stacked imgs]|                                   |  |
|  |  +----------------+  "Who joined you on this hike,     |  |
|  |                       and what was the highlight?"    |  |
|  |                                                       |  |
|  |  [ 🎙️ Speak Memory ]         [ ✍️ Write Context ]      |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [ Today ]                                                  |
|  [ Photo Thumb 1 ]  [ Photo Thumb 2 ]  [ Photo Thumb 3 ]    |
+-------------------------------------------------------------+
```

* **Interactive Elements:**
  * `[X Dismiss]` Button: 40x40dp touch target. Triggers soft dismissal with 14-day cooldown.
  * `[ 🎙️ Speak Memory ]` Button: Primary Pill button with Gemini sparkle border; triggers Bottom Sheet in Audio Dictation mode immediately.
  * `[ ✍️ Write Context ]` Button: Secondary Outlined button; triggers Bottom Sheet in Keyboard Text mode.

---

#### Flow 2: Memory Input Bottom Sheet (Modal Sheet)
Draggable sheet anchored to the bottom with 3 snap states: Collapsed (60% height), Expanded (90% height), Closed.

```text
+-------------------------------------------------------------+
|                          [=== Handle ===]                   |
|  [X Close]                 Add Memory Context      [💾 Save] |
|                                                             |
|  Trip to Lake Tahoe • July 15, 2026                         |
|  [Thumb 1] [Thumb 2] [Thumb 3] [Thumb 4] (+20 more)         |
|  ---------------------------------------------------------  |
|                                                             |
|  [ Prompt: "What made this moment memorable?" ]             |
|                                                             |
|  +-------------------------------------------------------+  |
|  | "We finally reached Emerald Bay after a 3-hour hike.   |  |
|  |  Maya fell in love with the sunset and we had that     |  |
|  |  amazing blueberry cheesecake by the campfire..."     |  |
|  |                                                       |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [ Live Audio Waveform (Animated): |||l|||!|||l|| ]         |
|                                                             |
|            [ 🔴 Recording (00:24) ]    [ ⏹️ Finish ]         |
|                                                             |
|  [✨ AI Entity Preview]:                                     |
|  (👥 Maya) (📍 Emerald Bay) (🥾 Hike) (🍰 Cheesecake)         |
|                                                             |
|  [Privacy: Visible only to you • Never used for ad targeting]|
+-------------------------------------------------------------+
```

* **Interaction Details:**
  * **Microphone State:** Pulsing cyan/purple gradient glow with live 12-bar audio visualizer (driven by WebAudio API or Android AudioRecord amplitude).
  * **Real-time Extraction Chips:** As the user speaks, lightweight on-device or streaming regex/NLU identifies entities in real time and renders interactive chips below.
  * **Chip Interaction:** Tapping an entity chip opens an inline edit popup to correct spelling or remove unintended entities.

---

#### Flow 3: Confirmation & Extraction Review Modal
Shown after user taps Save or finishes dictation.

```text
+-------------------------------------------------------------+
|  [✨ Memory Created!]                                        |
|                                                             |
|  "Trip to Lake Tahoe with Maya at Emerald Bay"              |
|                                                             |
|  Identified Details:                                        |
|  - People:   Maya Lin [Edit]                                |
|  - Place:    Emerald Bay, Lake Tahoe [Edit]                 |
|  - Occasion: Summer Hike & Campfire                         |
|  - Items:    Blueberry Cheesecake                           |
|  - Emotion:  Warm, Joyful                                   |
|                                                             |
|  Linked to: 24 photos in cluster                            |
|                                                             |
|  [ Try searching: "Show photos with Maya having cake" ]      |
|                                                             |
|  [  Done  ]                         [ Edit Full Context ]   |
+-------------------------------------------------------------+
```

---

#### Flow 4: Multimodal Search Integration
When user types or speaks into the main Google Photos search bar.

```text
+-------------------------------------------------------------+
|  [<-]  "that cafe where we had cheesecake in Tahoe"     [🎙️] |
+-------------------------------------------------------------+
|                                                             |
|  [✨ Matched via Memory Context]                             |
|  "Lake Tahoe Trip with Maya — July 2026"                    |
|                                                             |
|  Top Matches (4 photos):                                    |
|  +----------------+  +----------------+  +----------------+ |
|  | [Photo: Maya   |  | [Photo: Lake   |  | [Photo: Camp   | |
|  |  eating cake]  |  |  Sunset]       |  |  fire & tent]  | |
|  | 98% Match      |  | 89% Match      |  | 84% Match      | |
|  +----------------+  +----------------+  +----------------+ |
|                                                             |
|  Related Memories:                                          |
|  - "Lake Tahoe Summer Hike 2026" [View Memory Card]         |
|                                                             |
|  Other Photos from July 15:                                 |
|  [ Thumb ] [ Thumb ] [ Thumb ] [ Thumb ] [ Thumb ]          |
+-------------------------------------------------------------+
```

---

#### Flow 5: Memory Management & Settings Screen
Accessible via Google Photos Settings > Memories > AI Memory Context.

```text
+-------------------------------------------------------------+
|  [<-] Manage Memories                                       |
+-------------------------------------------------------------+
|                                                             |
|  AI Memory Context Features                                 |
|  [x] Enable Smart Memory Prompts                            |
|  [x] Allow Voice Transcription                              |
|  [ ] Include in Shared Album Suggestions                    |
|                                                             |
|  Your Saved Memories (14)                                   |
|  Search your memories: [ Filter... ]                        |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Lake Tahoe Hike with Maya                 July 2026   |  |
|  | 4 entities • 24 linked photos            [✏️]  [🗑️]  |  |
|  +-------------------------------------------------------+  |
|  | Mom's 60th Birthday Dinner                May 2026    |  |
|  | 8 entities • 52 linked photos            [✏️]  [🗑️]  |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [ ⚠️ Delete All Memories ]          [ 📥 Export Memories ]  |
+-------------------------------------------------------------+
```

---

### 4. Micro-Interactions & Animation Specs

| Interaction | Trigger | Animation Curve | Duration | Haptic Feedback |
|---|---|---|---|---|
| **Prompt Card Reveal** | Timeline scroll into viewport | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` (Emphasized Decelerate) | 450ms | None |
| **Card Dismissal** | Swipe left or tap [X] | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` (Accelerate) | 250ms | Light tick |
| **Mic Pulsing** | Active speech recording | Infinite Sinusoidal Loop (Scale 1.0 -> 1.08 -> 1.0) | 1200ms cycle | Gentle heartbeat interval |
| **Entity Chip Pop-in** | AI entity extracted | `cubic-bezier(0.34, 1.56, 0.64, 1)` (Spring overshoot) | 300ms | Light impact |
| **Memory Saved Checkmark**| Save completion | Scale 0 -> 1.2 -> 1.0 with SVG draw | 400ms | Heavy confirmation click |

---

### 5. Accessibility Guidelines (WCAG 2.1 AA)

1. **Touch Targets:** All clickable icons, chips, and buttons must be at least $48 \times 48\text{dp}$.
2. **Contrast Ratio:**
   - Body text against surface: $\ge 4.5:1$ (currently $9.2:1$ with `#202124` on `#FFFFFF`).
   - Secondary text & entity tags: $\ge 3:1$ against container background.
3. **Screen Readers (TalkBack / VoiceOver):**
   - Prompt Card: *"Suggestion: Add memory context for your trip to Lake Tahoe on July 15th. Double tap to speak."*
   - Audio Record Button: *"Start voice recording. Double tap to begin talking."*
   - Live Transcription: `accessibilityLiveRegion="polite"` announces recognized entities without interrupting active speech.
4. **Motion Sensitivity:** When `prefers-reduced-motion: reduce` is active, eliminate the spring overshoot and mic pulsation; replace with simple opacity fades (150ms).
