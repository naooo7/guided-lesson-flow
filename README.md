# Practice Hub

IMPORTANT: MODIFY THE EXISTING FUNDAMENTAL. APPLICATION. DO NOT CREATE A NEW WEBSITE, NEW APP, OR NEW VISUAL SYSTEM.
The current Practice implementation has drifted away from the existing Fundamental. product and now looks like a newly created learning dashboard.
I want to correct this.
PRIMARY OBJECTIVE
Modify ONLY the existing Practice page/section inside the current Fundamental. application.
The goal is to transform the existing Practice page into a simple Practice Hub with five learning modes:
Drill Soal
Latihan Soal
Try Out
Read
Fundamental.
This is a structural redesign of the EXISTING Practice experience, NOT a rebuild of the application.
VERY IMPORTANT — PRESERVE THE EXISTING APP
Before making changes, inspect the current application structure and reuse the existing:
app shell
navigation
desktop sidebar
mobile navigation
typography
spacing system
colors
light/dark theme
buttons
cards
icons
components
page transitions
responsive behavior
overall Fundamental. visual identity
Do NOT replace these with a new design system.
Do NOT create a new landing page.
Do NOT create a new dashboard-style website.
Do NOT introduce a new hero section such as:
"Your Learning Space"
"Ways to Practice"
"Pick up where you left off"
"Recommended for you"
unless those elements already exist in the current Fundamental. Practice page and are necessary to preserve the existing design.
Remove the newly introduced "learning dashboard" structure if it is part of the current Practice implementation.
The Practice page should feel like the SAME Fundamental. application, simply with a better Practice structure.
SCOPE
ONLY modify:
Practice
You may create minimal internal screens/states/routes required for the five Practice modes, but they should remain visually and structurally part of the existing Fundamental. application.
DO NOT modify:
Home
Progress
Profile
existing desktop sidebar
existing mobile navigation
global theme
global typography
unrelated components
existing result page
existing question page
existing institution theme
unless a tiny shared-component adjustment is absolutely required for consistency.
PRACTICE LANDING PAGE
The existing Practice page currently presents exam categories too early, such as:
SKD
UTBK
TPA
TBI
Psikotes
Do NOT show these as the first-level Practice choices anymore.
Instead, the first level should answer:
"How do you want to practice?"
Show five clear choices:
1. DRILL SOAL
Title:
Drill Soal
Description:
Latihan bebas sesuai kebutuhanmu.
Concept:
This is the customizable practice mode.
The user should understand immediately that this mode allows them to decide what they want to practice.
When clicked, it can later lead to:
Category → Material → Difficulty → Number of questions → Time → Start
But DO NOT fully build this configuration system yet.
For now, create only the entry point and a simple placeholder/preview state if needed.
2. LATIHAN SOAL
Title:
Latihan Soal
Description:
Bangun kemampuanmu secara bertahap.
Concept:
This is the structured learning path.
It should eventually work like a progression system:
Level → A → B → C → D → Final Boss
But DO NOT fully implement the progression system yet.
For now, create the entry point and a simple preview that communicates the concept.
Example preview:
Matematika
Level 1
A · Operasi Dasar
B · Pecahan
C · Persentase
D · Perbandingan
Final Boss
This is only a visual concept/mock state.
3. TRY OUT
Title:
Try Out
Description:
Uji kemampuanmu dalam simulasi ujian.
Concept:
A realistic exam simulation.
Eventually this can contain:
SKD
UTBK
TPA
TBI
other simulations
But DO NOT expose those categories as the first-level Practice navigation.
For now, show a simple Try Out entry/preview.
Example:
SKD Try Out #01
110 soal · 100 menit
[Mulai]
Use mock data only.
4. READ
Title:
Read
Description:
Belajar lewat bacaan dan pemahaman.
Concept:
A reading-based learning area.
Eventually this can contain:
English reading
vocabulary
grammar notes
Bahasa Indonesia
EYD
SPOK
articles
documents
ebooks
reading comprehension
But DO NOT build a full document/ebook system yet.
For now, create a simple entry/preview state showing that this is a reading area.
Example:
English Reading
"Understanding Context"
7 min read
Bahasa Indonesia
"Kalimat Efektif"
5 min read
Use mock content.
5. FUNDAMENTAL.
Title:
Fundamental.
Description:
Perkuat kemampuan dasar yang menjadi fondasi belajar.
This should feel special and distinct from exam preparation.
It is NOT another exam category.
It is a foundation-learning area.
Eventually it can contain:
Mathematics
Addition
Subtraction
Multiplication
Division
Fractions
Decimals
Percentages
Ratios
Powers
Roots
English
Vocabulary
Basic Grammar
Sentence Structure
Common Expressions
Reading
Bahasa Indonesia
EYD
SPOK
Kata Baku
Tanda Baca
Kalimat Efektif
Sinonim
Antonim
Logic
Patterns
Sequences
Classification
Analogy
But DO NOT build the entire Fundamental. learning system yet.
For now, create the entry point and a small preview of the concept.
VISUAL STRUCTURE
Keep the Practice page simple.
Do NOT turn it into a large dashboard.
The hierarchy should be:
Practice
Short supporting description
↓
Five learning modes
Drill Soal
Latihan Soal
Try Out
Read
Fundamental.
Each mode should have:
title
short description
subtle supporting visual/icon if consistent with the existing design
clear click/tap affordance
Avoid:
huge hero banners
excessive cards
unnecessary statistics
fake analytics
multiple recommendation sections
excessive badges
excessive gamification
decorative gradients
large illustrations
unnecessary empty areas
The user should understand the five options within a few seconds.
DESKTOP
The existing desktop sidebar is ALREADY implemented.
DO NOT redesign or replace it.
The Practice content should use the available desktop space properly.
Do NOT render the mobile Practice layout inside a narrow column next to the sidebar.
On desktop:
use a proportional content width
use a clean 2-column arrangement if appropriate
maintain consistent spacing
make the five choices feel balanced
avoid large unused areas
maintain the same visual language as the rest of Fundamental.
The desktop layout should feel intentionally designed for desktop.
MOBILE
Do NOT redesign the existing mobile application.
Only adapt the new Practice structure to mobile.
Use:
stacked layout
comfortable touch targets
reasonable card height
compact spacing
same hierarchy as desktop
Do NOT introduce oversized mobile cards.
INTERACTION
The prototype must be clickable.
Practice
→ Drill Soal
Practice
→ Latihan Soal
Practice
→ Try Out
Practice
→ Read
Practice
→ Fundamental.
Each should open a simple preview/internal screen that demonstrates the intended direction.
However:
DO NOT fully implement the future systems yet.
Do not build:
real question generation
database
backend
authentication
scoring engine
adaptive algorithm
document upload
ebook reader engine
full progression engine
Use mock data only.
IMPORTANT PRODUCT PRINCIPLE
These five modes must have clearly different purposes:
Drill Soal
= bebas + customizable
Latihan Soal
= structured progression
Try Out
= realistic simulation
Read
= reading and comprehension
Fundamental.
= basic skill building
Do not make them look like five different versions of the same question bank.
EXISTING CONTENT
If the existing Practice page already contains useful components or interactions, reuse them where appropriate.
Do not delete working functionality unnecessarily.
Move existing exam categories deeper into the relevant mode where appropriate.
For example:
SKD / UTBK / TPA / TBI / Psikotes
should NOT be the first thing shown when opening Practice.
They can later appear inside:
Drill Soal
Try Out
Latihan Soal
depending on the mode.
RESPONSIVE VALIDATION
After implementation, verify:
Existing Home is unchanged.
Existing Progress is unchanged.
Existing Profile is unchanged.
Existing desktop sidebar is unchanged.
Existing mobile navigation is unchanged.
Existing theme system is unchanged.
Practice opens as the new five-mode Practice Hub.
The five modes are clickable.
No new unrelated dashboard/landing page has been introduced.
Desktop does not look like a stretched mobile page.
Mobile remains compact and usable.
No large unexplained empty areas appear.
No dead-end interaction is introduced.
The final result should look like:
Fundamental.
same application,
same design language,
same navigation,
but with a much clearer:
Practice → 5 ways to learn
experience.
DO NOT rebuild the application.
DO NOT create a separate Practice website.
DO NOT redesign the entire app.
Modify the existing Practice experience only.
https://github.com/naooo7/progress-weave-dash

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5dd17d28-aeba-4ba0-828e-2f07af070e28).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
