# How the layered participant presets work

This guide walks through the code behind the **Select from Participants**, **Select from Gallery** and **Select &lt;group&gt; participants** presets. Read it top to bottom with the code open next to it. Each part covers one file or function, shows the code, and shows what that code turns into in Companion.

- [1. The big picture](#1-the-big-picture)
- [2. Four Companion v2 ideas you need](#2-four-companion-v2-ideas-you-need)
- [3. The section files](#3-the-section-files)
- [4. Turning one button into a template](#4-turning-one-button-into-a-template)
- [5. Finding the participant name from a position](#5-finding-the-participant-name-from-a-position)
- [6. The button itself](#6-the-button-itself)
- [7. The icons](#7-the-icons)
- [8. Recipes for common changes](#8-recipes-for-common-changes)
- [9. Gotchas](#9-gotchas)
- [10. Where the tests are](#10-where-the-tests-are)

---

## 1. The big picture

Each participant-style section is **one layered button design**, published as a **template**. Companion turns that one design into a button per position (1–49) in the preset list. Every button remembers its own position in a button-local variable called `position`.

```
src/presets.ts  UpdatePresets()
   │  asks each category file for its section(s) + presets
   ▼
src/presets/preset-gallery.ts        ┐
src/presets/preset-participants.ts   ├─ each calls buildParticipantTemplateSection(...)
src/presets/preset-groups.ts (×group)┘  with the few things that differ per section
   │
   ▼
src/presets/preset-utils.ts  buildParticipantTemplateSection()
   │  1. builds ONE layered button with buildParticipantLayeredPreset()
   │     where every "position" is the expression $(local:position)
   │  2. wraps it in a template group listing positions 1..49
   ▼
src/presets/preset-utils.ts  buildParticipantLayeredPreset()
   │  the button: layers (elements) + feedbacks that change those layers
   ▼
Companion: the user drags "Gallery position 7" → a button whose local variable position = 7
```

Supporting files:

| File                                    | What it holds                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/participant-icons.ts`              | The six status icons: label, image-library name, module variable, built-in image      |
| `src/images-layers.ts`                  | The built-in icon images as data URIs (generated, don't edit)                         |
| `scripts/extract-layer-icons.mjs`       | Generates `src/images-layers.ts` and `assets/layers/*.png` from the old composites    |
| `src/variables/variable-definitions.ts` | Declares the `icon_*` module variables                                                |
| `src/variables/variable-values.ts`      | `updateIconVariables()` writes the built-in images into those variables               |
| `src/feedback.ts`                       | The boolean feedbacks the button uses (`gallery_Based`, `index_Based`, `group_Based`) |

The old **advanced** multi-state feedbacks, the composite images in `src/images.ts` and `src/feedback-state-machine.ts` are no longer used by any preset. They're kept only so buttons people built before this change keep working. They're marked "(Deprecated)" in Companion, because they'll be removed in a future version.

---

## 2. Four Companion v2 ideas you need

### 2.1 A layered button is a stack of elements

A v1 "simple" button had one `style` (text, colour, background image). A v2 **layered** button has a list of **elements**, such as boxes, images, text and circles. Companion draws them **in array order**: the first element is drawn first (at the bottom), and each later one is drawn on top of it.

```ts
elements: [
	{ id: 'background', type: 'box', color: 0x000000 /* … */ }, // drawn first (bottom)
	{ id: 'name', type: 'text', text: 'Jane' /* … */ },
	{ id: 'speakerGroup', type: 'group', enabled: false, children: [/* … */] }, // drawn last (top)
]
```

A **group** element holds other elements as `children`, drawn in the group's place. Disabling the group hides all of its children, whatever their own `enabled` says.

### 2.2 Feedbacks change one property of one element

In a layered button, a feedback doesn't return a style. Instead it carries **style overrides**: "when I'm true, set this element's property to this value".

```json
{
	"feedbackId": "gallery_Based",
	"options": { "position": 3, "type": 3 },
	"styleOverrides": [{ "elementId": "camera", "elementProperty": "base64Image", "override": "…image…" }]
}
```

This is why the icons can stack. The camera feedback only changes the `camera` element, and the mic feedback only changes the `mic` element. On a v1 simple button there was only one `png64`, so the last feedback won. That's why the old code needed pre-combined images.

The `type` number is the `feedbackType` enum in `src/feedback.ts` (for example 0 = selected, 3 = camera, 4 = activeSpeaker, 8 = spotlightOn).

### 2.3 Values or expressions

Any property or option can be a plain value, or an expression:

```ts
color: 16777215                                           // plain value
text: { isExpression: true, value: '`3. ${$(zoomosc:GalleryPosition03)}`' }  // expression
```

The code writes plain values without a wrapper to keep presets small. Only expressions get `{ isExpression: true, value }`. The helper for that is one line in `preset-utils.ts`:

```ts
const expression = (v: string): ExpressionOrValue<string> => ({ isExpression: true, value: v })
```

### 2.4 Templates and local variables

A **template group** lists one preset id plus a list of values. Companion shows one preset button per value. When the user drags one onto a page, Companion copies the preset and sets the button's **local variable** (here `position`) to that value. Anything on the button can read it as `$(local:position)`.

That's why the code never says "position 7". It always says `$(local:position)`. One design then works for every position, and the user can reach position 50+ by editing that local variable.

---

## 3. The section files

Each section file only describes **what's different** about its section. Here's the gallery (`src/presets/preset-gallery.ts`):

```ts
return buildParticipantTemplateSection({
	sectionId: 'gallery',
	sectionName: 'Select from Gallery',
	presetId: galleryTemplatePresetId, // 'Gallery_position'
	presetName: 'Gallery position',
	positions: galleryPositions, // 49
	positionName: (position) => `Gallery position ${position}`,
	nameExpression: positionVariableExpression('GalleryPosition', 2),
	target: (position) => ({ feedbackId: FeedbackId.galleryBased, options: { position } }),
	action: (position) => ({
		actionId: ActionIdGallery.selectFromGalleryPosition,
		options: { position, option: 'toggle' },
	}),
})
```

| Parameter        | Meaning                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `sectionId/Name` | The collapsible category in Companion's preset list                                                                                |
| `presetId`       | Id of the single template preset                                                                                                   |
| `positions`      | How many buttons the template lists (49)                                                                                           |
| `positionName`   | The label of each listed button                                                                                                    |
| `nameExpression` | How to look up the participant's name for the button's position (see [section 5](#5-finding-the-participant-name-from-a-position)) |
| `target`         | Which boolean feedback drives the button, and with which options. `position` is handed in already as `$(local:position)`           |
| `action`         | What pressing the button does. `position` is handed in as an expression too                                                        |

`target` and `action` are small functions rather than plain objects. The builder decides how the position is written: an expression on the local variable. The section file decides where the position goes: which option of which feedback or action.

The three sections side by side:

| Section                           | File                               | Feedback                  | Action                                    | Name variable                     | Positions        |
| --------------------------------- | ---------------------------------- | ------------------------- | ----------------------------------------- | --------------------------------- | ---------------- |
| Select from Participants          | `preset-participants.ts`           | `index_Based`             | `selectFromIndexPosition`                 | `Participant007` (padded to 3)    | 49               |
| Select from Gallery               | `preset-gallery.ts`                | `gallery_Based`           | `selectFromGalleryPosition`               | `GalleryPosition07` (padded to 2) | 49               |
| Select &lt;group&gt; participants | `preset-groups.ts` (one per group) | `group_Based` (+ `group`) | `selectUserFromGroupPosition` (+ `group`) | `Group2Position7` (not padded)    | 49, Spotlights 9 |

**Select by name** (`src/presets/preset-manage-selections.ts`) uses the same button, but it isn't a template: there's no position. It calls `buildParticipantLayeredPreset()` directly with the `user_Name_Based` feedback and a `name` local variable:

```ts
[PresetIdManageSelections.selectByName]: buildParticipantLayeredPreset({
	name: 'Select by name',
	nameExpression: `${localName} || 'Select by name'`, // localName = '$(local:name)'
	target: { feedbackId: FeedbackId.userNameBased, options: { name: localName } },
	steps: [
		{
			down: [{ actionId: ActionIdUsers.selectUserByName, options: { option: 'toggle', name: localName } }],
			up: [],
		},
	],
	localVariables: [{ variableType: 'simple', variableName: 'name', startupValue: '' }],
}),
```

- The user types the participant's name once, into the button's `name` local variable.
- The action's and feedbacks' `name` fields resolve variables, so a plain `$(local:name)` works there.
- `positionText` is left out, so the button text has no "N." prefix. It shows the name, or "Select by name" while it's empty.

**Active Speaker** (same file) is built the same way, with the module's `$(zoomosc:activeSpeaker)` variable in place of the local variable. That variable always holds the name of whoever is speaking, so the button, its feedbacks and its "Preselect user by name" action (option Toggle) follow the active speaker. There's no local variable on this one. It's built with `alwaysSpeaking: true`, so the Active Speaker group starts enabled and the name starts laid out below the bar (see [Active speaker](#active-speaker)), and the button has no Active Speaker feedback.

The participant section needs **Enable Variable For Participants** turned on in the module config. Both the `Participant007` variables and the `index_Based` feedback depend on it.

---

## 4. Turning one button into a template

`buildParticipantTemplateSection()` in `src/presets/preset-utils.ts` does two things.

**1. Build the one button**, writing every position as the local variable:

```ts
const preset = buildParticipantLayeredPreset({
	name: params.presetName,
	nameExpression: params.nameExpression,
	positionText: `\${${localPosition}}`, // → ${$(local:position)} inside the name text
	target: params.target({ isExpression: true, value: localPosition }), // → $(local:position)
	steps: [{ down: [params.action({ isExpression: true, value: `concat(${localPosition})` })], up: [] }],
	localVariables: [{ variableType: 'simple', variableName: templatePositionVariable, startupValue: 1 }],
})
```

Two details:

- The action uses `concat($(local:position))` rather than `$(local:position)`. The position dropdowns on the select actions use **string** ids (`'7'`), and `concat()` turns the number 7 into the string `'7'`.
- `localVariables` declares the `position` variable on the button. `startupValue: 1` is only a default, because Companion sets the real value from the template.

**2. Wrap it in a template group.** The section holds exactly one group, because Companion only accepts a template preset inside a template group:

```ts
definitions: [
	{
		id: `${params.sectionId}_positions`,
		type: 'template',
		name: params.sectionName,
		presetId: params.presetId,
		templateVariableName: templatePositionVariable, // 'position'
		templateValues: Array.from({ length: params.positions }, (_, i) => ({
			name: params.positionName(i + 1),
			value: i + 1,
		})),
	},
]
```

What Companion actually receives for the gallery:

```json
{
	"id": "gallery",
	"name": "Select from Gallery",
	"definitions": [
		{
			"id": "gallery_positions",
			"type": "template",
			"presetId": "Gallery_position",
			"templateVariableName": "position",
			"templateValues": [
				{ "name": "Gallery position 1", "value": 1 },
				{ "name": "Gallery position 2", "value": 2 }
			]
		}
	]
}
```

The `templateValues` list continues up to 49.

**Why templates at all?** Before this, each section had a separate preset per position: 1,000 for participants and 1,000 per group. As full layered buttons, that came to about 36 MB. Companion couldn't process them within its 10-second start-up limit, so it kept restarting the module. With templates, the whole module sends 190 presets (about 0.1 MB) when three groups are configured.

---

## 5. Finding the participant name from a position

The name variables have the position **inside the variable name**, sometimes zero-padded: `$(zoomosc:Participant007)`. A template can't hard-code that, so `positionVariableExpression()` builds the variable reference as text and asks Companion to resolve it:

```ts
export const positionVariableExpression = (prefix: string, padTo = 1): string => {
	const position = padTo > 1 ? `substr(concat('${'0'.repeat(padTo - 1)}', ${localPosition}), -${padTo})` : localPosition
	return `parseVariables(concat('$(zoomosc:${prefix}', ${position}, ')'))`
}
```

For `positionVariableExpression('Participant', 3)`, this produces:

```
parseVariables(concat('$(zoomosc:Participant', substr(concat('00', $(local:position)), -3), ')'))
```

Evaluated on a button whose `position` is 7:

| Step                                          | Result                                |
| --------------------------------------------- | ------------------------------------- |
| `concat('00', 7)`                             | `'007'`                               |
| `substr('007', -3)` (last 3 characters)       | `'007'` (for 12 → `'0012'` → `'012'`) |
| `concat('$(zoomosc:Participant', '007', ')')` | `'$(zoomosc:Participant007)'`         |
| `parseVariables(…)`                           | the participant's name                |

Groups don't pad, so `positionVariableExpression('Group2Position')` is just `parseVariables(concat('$(zoomosc:Group2Position', $(local:position), ')'))`.

The connection label `zoomosc` gets rewritten when the preset is used. Companion replaces every `$(zoomosc:` in the preset with the real connection label, for example `$(mini1_zoomiso:`, and that includes this text inside the expression.

The name text then wraps that lookup:

```ts
const nameText = (prefix: string, length: number): string =>
	`\`${prefix}${positionText}. \${substr(${nameExpression},0,${length})}\``
```

That gives the name element this text:

```
`${$(local:position)}. ${substr(parseVariables(concat('$(zoomosc:GalleryPosition', substr(concat('0', $(local:position)), -2), ')')),0,50)}`
```

On position 7 it shows `7. Jane Doe`, cut to 50 characters. The active-speaker version adds `\n` in front (to move below the bar) and cuts to 40 characters.

---

## 6. The button itself

`buildParticipantLayeredPreset()` in `src/presets/preset-utils.ts` returns the whole layered button:

```ts
return {
	type: 'layered',
	name: params.name,
	canvas: { decoration: ButtonGraphicsDecorationType.Border },
	elements,
	feedbacks,
	steps: params.steps,
	...(params.localVariables ? { localVariables: params.localVariables } : {}),
}
```

It's the same design as the Gallery Position 3 button that was built and tested by hand in Companion.

### 6.1 Element ids

Every element has a fixed id so feedbacks can point at it. They're collected in `ParticipantElement`, used as `e` inside the function:

```ts
export const ParticipantElement = {
	background: 'background',
	spotlight: 'spotlight',
	selected: 'selected',
	camera: 'camera',
	mic: 'mic',
	hand: 'hand',
	name: 'name',
	speakerGroup: 'speakerGroup',
	speakerBar: 'speakerBar',
	speakerText: 'speakerText',
	spotlightCircle: 'spotlightCircle',
} as const
```

### 6.2 The elements (layers), bottom to top

```ts
const elements: SomeButtonGraphicsElement[] = [
	box(e.background, 'Background', colorBlack, true),
	box(e.spotlight, 'Spotlight', colorDarkRed, false),
	box(e.selected, 'Selected', colorDarkGray, false),
	iconImage(e.camera, 'Camera Status'),
	iconImage(e.mic, 'Mic Status'),
	iconImage(e.hand, 'Hand Raised Status'),
	{ id: e.name, name: 'Attendee Name', type: 'text' /* … */ },
	{
		id: e.speakerGroup,
		name: 'Active Speaker Group',
		type: 'group',
		enabled: false,
		children: [
			box(e.speakerBar, 'Active Speaker', colorSpeakerBlue, true, 15),
			{ id: e.speakerText, name: 'Active Speaker Text', type: 'text', enabled: true /* … */ },
		],
	},
	{ id: e.spotlightCircle, name: 'Spotlight Circle', type: 'circle' /* … */ },
]
```

| #   | Id (name in Companion editor)         | Type   | Starts | Notes                                                                                   |
| --- | ------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------- |
| 1   | `background` (Background)             | box    | on     | Black, full button                                                                      |
| 2   | `spotlight` (Spotlight)               | box    | off    | Dark red, full button: the "spotlighted" background                                     |
| 3   | `selected` (Selected)                 | box    | off    | Dark gray, full button. It sits above `spotlight`, so selected wins when both are on    |
| 4–6 | `camera`, `mic`, `hand` (… Status)    | image  | empty  | Full-button transparent images; each icon is already drawn in its slot along the bottom |
| 7   | `name` (Attendee Name)                | text   | on     | White, top centre, size 16.7                                                            |
| 8   | `speakerGroup` (Active Speaker Group) | group  | off    | Holds the speaker bar and its label, so one override shows or hides both                |
| 8a  | ↳ `speakerBar` (Active Speaker)       | box    | on     | Blue (`colorSpeakerBlue` = 0,0,204), top 15% of the button                              |
| 8b  | ↳ `speakerText` (Active Speaker Text) | text   | on     | "SPEAKER" in bold white on the bar                                                      |
| 9   | `spotlightCircle` (Spotlight Circle)  | circle | off    | Dark red dot with a white border, top left                                              |

Positions and sizes (`x`, `y`, `width`, `height`) are **percentages of the button**. Most layers cover the whole button (`fullBounds = { x: 0, y: 0, width: 100, height: 100 }`).

The two small helpers just fill in the repeated properties:

```ts
const box = (id: string, name: string, color: number, enabled: boolean, height = 100): SomeButtonGraphicsElement => ({
	id,
	name,
	type: 'box',
	enabled,
	...fullBounds,
	height,
	color,
})

const iconImage = (id: string, name: string): SomeButtonGraphicsElement => ({
	id,
	name,
	type: 'image',
	enabled: true,
	...fullBounds,
	base64Image: null, // empty until a feedback sets an icon
	halign: 'center',
	valign: 'center',
	fillMode: 'fit',
})
```

### 6.3 The feedbacks

Every feedback on the button is one of the module's existing **boolean** participant feedbacks. Only its `type` changes. A small local helper builds them with the section's target:

```ts
const feedback = (type: feedbackType, isInverted = false): any => ({
	feedbackId: target.feedbackId, // gallery_Based / index_Based / group_Based
	options: { ...target.options, type }, // { position: $(local:position), (group,) type }
	...(isInverted ? { isInverted } : {}),
})
```

Overrides are written with:

```ts
const override = (elementId, elementProperty, to) => ({ elementId, elementProperty, override: to })
```

The feedback list, in order:

```ts
const feedbacks: SomePresetLayeredFeedbackEntry<ModuleSchema>[] = [
	andGroup('Spotlighted but not Selected', [spotlightOnChild(), selectedChild(true)], [/* … */]),
	andGroup('Selected But Not Spotlighted', [spotlightOffChild(), selectedChild()], [/* … */]),
	andGroup('Selected and Spotlighted', [spotlightOnChild(), selectedChild()], [/* … */]),
	{ ...feedback(feedbackType.activeSpeaker), headline: 'Active Speaker', styleOverrides: [/* … */] },
	...iconFeedbacks.map(({ type, elementId, headline, icon }) => ({/* … */})),
]
```

Every feedback has a `headline`, the description shown in Companion's feedback list. The button's feedbacks read, in order: Spotlighted but not Selected, Selected But Not Spotlighted, Selected and Spotlighted, Active Speaker, Camera On, Camera Off, Mic On, Mic Off, Hand Raised.

#### Spotlight and selected: three AND groups

These are Companion's built-in **logic operator** feedback (`internal:logicOperator`, operation `and`). The group is true when all its child feedbacks are true, and then **the group's own overrides** apply.

```ts
const andGroup = (headline, children, styleOverrides) => ({
	feedbackId: 'internal:logicOperator',
	options: { operation: 'and' },
	children: { default: children },
	styleOverrides,
	headline,
})
```

| Group (headline)             | True when                                | Group overrides                                                                     |
| ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Spotlighted but not Selected | spotlight on **and** selected (inverted) | `spotlightCircle.enabled = false`, `name.color = white`, `spotlight.enabled = true` |
| Selected But Not Spotlighted | spotlight off **and** selected           | `spotlightCircle.enabled = false`, `name.color = white`, `selected.enabled = true`  |
| Selected and Spotlighted     | spotlight on **and** selected            | `spotlightCircle.enabled = true`, `selected.enabled = true`                         |

The result on the button:

| State                    | Looks like                                     |
| ------------------------ | ---------------------------------------------- |
| Neither                  | Black background                               |
| Spotlighted              | Dark red background                            |
| Selected                 | Dark gray background                           |
| Selected and spotlighted | Dark gray background with the red dot top-left |

The name is always white.

The **children** are only conditions, each with a headline ("Spotlight On", "Spotlight Off", "Selected"):

```ts
const condition = (
	type: feedbackType,
	headline: string,
	isInverted = false,
): SomePresetConditionEntry<ModuleSchema> => ({
	...feedback(type, isInverted),
	headline,
})
```

They have no style overrides of their own. When Companion turns a preset into a button, it copies a child's condition and headline but drops any overrides on it. The hand-built button had overrides on its children only because those feedbacks started outside the group before being moved into it. All the styling comes from each group's own overrides.

Here's what Companion receives for the "Selected and Spotlighted" group:

```json
{
	"feedbackId": "internal:logicOperator",
	"options": { "operation": "and" },
	"headline": "Selected and Spotlighted",
	"children": {
		"default": [
			{
				"feedbackId": "gallery_Based",
				"options": { "position": { "isExpression": true, "value": "$(local:position)" }, "type": 8 },
				"headline": "Spotlight On"
			},
			{
				"feedbackId": "gallery_Based",
				"options": { "position": { "isExpression": true, "value": "$(local:position)" }, "type": 0 },
				"headline": "Selected"
			}
		]
	},
	"styleOverrides": [
		{ "elementId": "spotlightCircle", "elementProperty": "enabled", "override": true },
		{ "elementId": "selected", "elementProperty": "enabled", "override": true }
	]
}
```

#### Active speaker

```ts
{
	...feedback(feedbackType.activeSpeaker),
	headline: 'Active Speaker',
	styleOverrides: [
		override(e.speakerGroup, 'enabled', true),
		override(e.name, 'text', expression(nameText('\\n', buttonTextActiveSpeakerLength))),
		override(e.name, 'halign', 'left'),
		override(e.name, 'valign', 'top'),
	],
}
```

When the participant is the active speaker:

- The Active Speaker group is enabled, so the blue bar and its "SPEAKER" label appear. Both stay enabled inside the group; only the group is switched.
- The name moves down one line (`\n`) so it isn't under the bar, aligns left, and is cut to 40 characters.

With `alwaysSpeaking: true` (the Active Speaker preset), that is the button's starting layout instead: the group is enabled, the name element already has the `\n` text and left alignment, and this feedback is left out.

#### Mic, camera and hand icons

```ts
...iconFeedbacks.map(({ type, elementId, headline, icon }) => ({
	...feedback(type),
	headline,
	styleOverrides: [override(elementId, 'base64Image', expression(participantIconExpression(icon)))],
})),
```

Each icon feedback sets one image element to its icon expression. For example, `camera` (type 3) sets the `camera` element:

```json
{
	"feedbackId": "gallery_Based",
	"options": { "position": { "isExpression": true, "value": "$(local:position)" }, "type": 3 },
	"headline": "Camera On",
	"styleOverrides": [
		{
			"elementId": "camera",
			"elementProperty": "base64Image",
			"override": {
				"isExpression": true,
				"value": "getVariable('image', 'zoom_camera_on') || $(zoomosc:icon_camera_on)"
			}
		}
	]
}
```

`iconFeedbacks` lists the six icon feedbacks in the order they appear on the button, with the icon each one shows. It's a fixed list, the same as the hand-built and tested button:

```ts
const iconFeedbacks: { type: feedbackType; elementId: string; headline: string; icon: ParticipantIcon }[] = [
	{
		type: feedbackType.camera,
		elementId: ParticipantElement.camera,
		headline: 'Camera On',
		icon: participantIcons.cameraOn,
	},
	{
		type: feedbackType.cameraOff,
		elementId: ParticipantElement.camera,
		headline: 'Camera Off',
		icon: participantIcons.cameraOff,
	},
	{ type: feedbackType.micLive, elementId: ParticipantElement.mic, headline: 'Mic On', icon: participantIcons.micOn },
	{ type: feedbackType.micOff, elementId: ParticipantElement.mic, headline: 'Mic Off', icon: participantIcons.micOff },
	{
		type: feedbackType.handRaised,
		elementId: ParticipantElement.hand,
		headline: 'Hand Raised',
		icon: participantIcons.handRaised,
	},
]
```

| Feedback    | Sets element | To                   |
| ----------- | ------------ | -------------------- |
| Camera On   | `camera`     | the camera-on icon   |
| Camera Off  | `camera`     | the camera-off icon  |
| Mic On      | `mic`        | the mic-on icon      |
| Mic Off     | `mic`        | the mic-off icon     |
| Hand Raised | `hand`       | the hand-raised icon |

**Hand Lowered isn't in the presets.** The idea was to ship it disabled, so a lowered hand shows nothing until a user turns it on. Companion's preset conversion only copies `definitionId`, `options`, `isInverted`, `styleOverrides` and `headline` from a preset feedback, so a `disabled` flag would be dropped. Leaving it out has the same effect. Users who want the lowered-hand icon add the Hand Lowered feedback themselves; HELP.md explains how. The hand-lowered icon, its `icon_hand_lowered` variable and the `zoom_hand_lowered` library name stay available for that.

The "Participant Multi-State Feedback" config setting doesn't affect these presets. It only applies to the deprecated advanced feedbacks.

---

## 7. The icons

### 7.1 One table for all six icons: `src/participant-icons.ts`

```ts
export const participantIcons = {
	micOn: { label: 'Mic On', libraryImage: 'zoom_mic_on', variable: 'icon_mic_on', image: layerImages.micOn },
	micOff: { label: 'Mic Off', libraryImage: 'zoom_mic_off', variable: 'icon_mic_off', image: layerImages.micOff },
	// cameraOn, cameraOff, handRaised, handLowered …
} as const

export const participantIconExpression = (icon: ParticipantIcon): string =>
	`getVariable('image', '${icon.libraryImage}') || $(zoomosc:${icon.variable})`
```

| Field          | Used for                                                                              |
| -------------- | ------------------------------------------------------------------------------------- |
| `libraryImage` | The name a user gives an image in Companion's **Image Library** to override this icon |
| `variable`     | The module variable holding the built-in icon (the fallback)                          |
| `image`        | The built-in icon itself, a data URI from `src/images-layers.ts`                      |
| `label`        | Used in the variable's description                                                    |

### 7.2 How the override works

Companion 5.1 publishes every Image Library image as a variable with the label `image`, such as `$(image:zoom_camera_on)`. The icon expression reads:

```
getVariable('image', 'zoom_camera_on') || $(zoomosc:icon_camera_on)
```

- If the user has added an image named `zoom_camera_on`, its data is used, on every layered participant, gallery and group button at once.
- If not, the library variable has no value and `||` falls back to the module's built-in icon.
- Deleting the library image goes back to the built-in icon.

**Why `getVariable('image', …)` and not `$(image:zoom_camera_on)`?** When a preset is placed on a button, Companion rewrites every `$(label:…)` in it to the module's connection label, except `$(local:…)` and `$(this:…)`. So `$(image:zoom_camera_on)` would become `$(mini1_zoomiso:zoom_camera_on)`, which doesn't exist. `getVariable()` takes the label and name as plain strings, which contain no `$(` for Companion to rewrite. The `$(zoomosc:icon_camera_on)` half is meant to be rewritten to the connection label.

### 7.3 The built-in icons as module variables

`src/variables/variable-definitions.ts` declares the six variables from the same table:

```ts
const iconVariables: CompanionVariableDefinitions<VariablesSchema> = Object.fromEntries(
	Object.values(participantIcons).map((icon) => [
		icon.variable,
		{
			name: `Default icon: ${icon.label} (override by adding a "${icon.libraryImage}" image to the image library)`,
		},
	]),
)
```

`src/variables/variable-values.ts` fills them in at startup:

```ts
export function updateIconVariables(variables: VariableValues): void {
	for (const icon of Object.values(participantIcons)) variables[icon.variable] = icon.image
}
```

### 7.4 Where the built-in images come from

`scripts/extract-layer-icons.mjs` (run with `yarn build:icons`) cuts the six icons out of two of the old composite images in `src/images.ts`:

- `BottomAllAllOn` gives the "on" icons.
- `BottomAllAllOff` gives the "off" icons.

Each icon is copied onto its own transparent 72×72 canvas, keeping its original position in the bottom row. That's why every image layer can simply cover the whole button. The script writes:

- `assets/layers/*.png`: the six icons as files, for reference or as templates for custom icons.
- `src/images-layers.ts`: the same icons as data URIs, used in code.

---

## 8. Recipes for common changes

**Change a colour or size.**

1. Edit the element in `elements` (section 6.2), or the colour constant in `src/utils.ts`.
2. If a feedback override sets the same property, change it there too. For example, the spotlight red is both the `spotlight` box colour and an override on `spotlightOnChild()`.

**Change how many positions a section lists.** Change `participantPositions` (`preset-participants.ts`), `galleryPositions` (`preset-gallery.ts`), or `groupPositions` / `spotlightGroupPositions` (`preset-groups.ts`).

**Add a new layer that a feedback turns on.**

1. Add an id to `ParticipantElement`.
2. Add the element to `elements`, in the right draw order, with `enabled: false`.
3. Add a feedback to `feedbacks` with `override(e.yourElement, 'enabled', true)`.

**Add a new participant-style section.** Call `buildParticipantTemplateSection()` from a category file, the way `preset-gallery.ts` does. Supply the name variable prefix and padding, the boolean feedback and the select action. Then add the category to `UpdatePresets()` in `src/presets.ts`.

**Replace a built-in icon in the module.** Edit or replace the PNG and regenerate `src/images-layers.ts`. The script currently cuts icons from `src/images.ts`, so swapping in new artwork means changing the script to read from `assets/layers/`. For a single installation, the Image Library override (section 7.2) needs no code change at all.

**Try a change in Companion.** Run `yarn build`. Companion reloads the dev module from `dist/`, and you re-drag the preset to see the new version. Buttons already on a page don't change, because presets are copied onto a button when it's added.

---

## 9. Gotchas

- **Draw order is array order.** An element later in `elements` is drawn on top. `selected` must stay after `spotlight`, and the Active Speaker group after the name.
- **Overrides only apply while the feedback is true.** "Off" states come from the element's own starting values, not from a feedback.
- **The position option is an expression everywhere.** Feedbacks get `$(local:position)` (a number), and the select actions get `concat($(local:position))` (a string, because those dropdowns use string ids).
- **Every `$(label:…)` in a preset is rewritten to the connection label** when the preset is used, even inside expression text. The only exceptions are `$(local:…)` and `$(this:…)`. Write this module's variables as `$(zoomosc:…)`. For anything outside the module, such as image library images or custom variables, use `getVariable('label', 'name')` in an expression instead.
- **Feedbacks inside an AND group can't style the button.** Companion drops style overrides on a logic group's children when a preset becomes a button. Put overrides on the group itself.
- **Keep preset size in mind.** Companion processes every preset when the module starts. Thousands of layered presets made startup time out, which is why each section is a single template.
- **Participants need Enable Variable For Participants.** Without it, the names are blank and the participant feedbacks never turn true.
- **The deprecated multi-state feedbacks remain.** `src/feedback-state-machine.ts`, `src/images.ts` and the four "(Deprecated)" advanced feedbacks only serve old buttons. No preset uses them.

---

## 10. Where the tests are

| Test file                                | Covers                                                                                                                                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/presets/preset-layered.test.ts`   | The button: element order, override targets, the AND groups, active speaker, icon expressions, feedback headlines and order, and the template sections (positions, local variable, name expressions) |
| `tests/presets/presets.test.ts`          | The overall preset structure: every preset listed once, sections without nested groups (except template groups), and every action and feedback option matching its definition                        |
| `tests/variables/icon-variables.test.ts` | The six `icon_*` variables are defined and hold PNG data URIs                                                                                                                                        |
| `tests/definitions/definitions.test.ts`  | The deprecated advanced feedbacks are still registered and labelled                                                                                                                                  |
