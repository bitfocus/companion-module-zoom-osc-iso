# companion-module-zoom-osc-iso

See [HELP.md](./HELP.md) and [LICENSE](./LICENSE)

## Basic Workflow Paths and Use Cases

There are many possible use-cases for this module. While not exhaustive, a few possible workflows are described below. In general, the module is designed for the following control pattern:

First select user(s), then apply action(s).

## Moderating Zoom

Managing the participants in a Zoom meeting often involves hunting through sub-menus or drop down lists, and this can be inefficient at scale, especially during quick transitions. With the ZoomOSC/ISO module, you can create a control surface for Zoom that is optimized for this use case. You can leverage the gallery-based participants list to make sure that the buttons automatically contain the names of the most relevant participants. Feedback available on the preset buttons will automatically change color based on video and audio status, and display a hand-raised icon.

### Setting Up Moderating Zoom

1. Under Presets open the “Select from Gallery” category. Drag the buttons onto your StreamDeck, leaving room on the sides and bottom for actions!

   ![Presets](companion/images/3.png)

1. Set ZoomOSC/ISO to gallery view. It is important to remain in gallery view while using these buttons. You can resize the Zoom window so the number of rows and columns in the gallery view match the arrangement of gallery buttons on your StreamDeck.
1. Explore the other preset categories and add action buttons for managing pin, spotlight, video, mute, etc. Add buttons to return to gallery view and toggle selection method. You can adjust the background color and key styling as needed.

   ![Other presets](companion/images/4.png)

1. To operate the page, you can select participants (their names will automatically appear based on the order of the gallery view) and then pick an action to apply to that individual or group.

## ZoomISO Configuration

ZoomISO can be controlled by this module to allow you to route participants to video outputs and audio channels easily. You can also change ZoomISO’s settings from this module, including control of the number of outputs and the state of the engine. For advanced users, the outputs and channels of ZoomISO are also selectable, so you can select participants and outputs in any order, and then match them to each other like a traditional video matrix.

### Setting Up ZoomISO Configuration

1. Under Presets open the “Select from Participants” category. Drag the buttons onto your StreamDeck, leaving room on the sides and bottom for actions![ZoomISO Configuration](companion/images/5.png)

2. Ensure Companion is in single selection mode. We will assume ZoomISO has 8 outputs in this example. Output properties can be configured by Companion, or through the ZoomISO UI. Make sure that ZoomISO has the necessary permissions for raw data access.

3. Under the preset category "ZoomISO Actions" drag 8 copies of the button called “Set User to Output” and place them on the right side of the StreamDeck. Change the Output field of each button so it targets a unique ZoomISO output and rename the keys accordingly. You can also drag buttons for managing other ZoomISO properties, as well as some meeting management functions that could be helpful in combination with ZoomISO.![ZoomISO Actions](companion/images/6.png)
4. To operate the page, select a participant and tap on an output to change who is being sent out of the ZoomISO outputs.

## Personal Controls

The ZoomOSC/ISO module is a great way to manage your own settings and controls within a Zoom call as a participant. Many of the actions can be configured to act upon your local settings, making it much easier to configure certain functions like audio and video controls without needing to navigate any menus. The Join Meeting button allows you to enter your recurring meetings and easily join them with a single button press. Together these actions can be an ergonomic management solution for self-participation in Zoom.

### Setting Up Personal Controls

1. Under Presets select “Join/Leave/End Actions” and drag several copies of the “Join Meeting” button. Drag over a Leave Meeting button as well.
1. You can set a custom name for each button, and enter the Meeting ID, Password, and your Display Name into each button. You can use custom colors, or even upload your own images to represent the different meetings you want to access. Remember to sign into ZoomOSC/ISO if these meetings require registration.
1. Return to Presets and drag buttons from “Video/Audio Actions” as well as “Devices & Settings Actions” onto your StreamDeck. For each button, set the properties appropriately. Importantly, in the username field, enter “Me” to make the button reference yourself. This is a macro keyword that will always reference you, regardless of your Zoom display name.

   ![Join Actions](companion/images/7.png)

## Selections and Groups

Selections are a key component of this module. With names of Zoom participants automatically appearing on your keys, selections allow you to designate which users to act upon. There are many workflows for selection, including single-selection, multi-selection, and groups.

### Select from Participants

This is a Preset Category of buttons as well as a variable reference representing the participants in the meeting in a largely static list. The order of members in the list will not generally change unless ZoomOSC/ISO leaves and rejoins the meeting. New participants are added to the end of the list, and participants who leave the meeting are removed from the list (decrementing the indices of subsequent users in the list). You can apply a global offset to the group indices using the Next Participants and Previous Participants actions.

Select from Participants is helpful when you don’t want your buttons to automatically change which participants they are tied to because of in-meeting actions by the participants. It is a simple list without many external behavior associations or dependencies, which makes it helpful in many use cases.

### Select from Gallery

This is a Preset Category of buttons as well as a variable reference representing the participants in the meeting based upon their order in the Gallery View of ZoomOSC/ISO (linearized top left to bottom right). This list will change order automatically based on any of the factors that can influence the gallery view order, including hand raising, speaking, enabling video, manual reorder, pagination, resizing, and more. The list will never contain more members than those visually represented on screen in the Zoom Gallery View, so it has a maximum length of 49. It is essential that ZoomOSC/ISO be in gallery view in order for this list to be accurate.

Select from Gallery is helpful for having a visual correspondence between the buttons and the Zoom interface, especially if the Zoom window is resized so that both the StreamDeck and the Gallery View have the same arrangement of participants in terms of rows and columns. Furthermore, the behaviors that influence the order of the Zoom Gallery View often correspond to the relevancy of those participants to the meeting, making it easy to find key individuals to act upon without requiring an extensive search.

### Single vs Multi Selection Mode

The module has a concept of a selection mode that can be set to either Single Selection or Multi Selection. In Multi Selection mode, you can tap on a participant once to select them, and then tap on them again to deselect them. In Single Selection mode, tapping on a participant will select them and automatically deselect any previous selection.

For actions that can be applied to many participants at once, Multi Selection is helpful, whereas for actions that can only function on a single participant, Single Selection is ideal.

### Selection Management and Action References

By default, most actions will act upon the selected participants. You can override this behavior by entering a username of the participant to act upon, or entering the macro string “Me” to reference your personal user. If the username field is blank, the module will reference the selection. If the action only accepts one participant, but multiple participants are selected, the action will be taken on the first user to be selected.

The module respects the order of selections, so when acting on multiple participants, the actions will first be taken on the first members to be selected, and then finish with the participants most recently added to the selection. This is important for commands like Add Spotlight, where the order of selection will determine the visual order of the spotlit users.

There are several variables and actions to help you manage the selection process available in the module. For example, since actions do not automatically deselect the participants acted upon, you can add a “Clear Selections” action to deselect them.

## Variables and Feedback

This module supports many variables and feedback properties. These are helpful for automatically changing key properties like the name and color of a button. Variables can also be used for basic automation systems in the Triggers workflow within Companion. Most preset buttons already contain the necessary feedback and variable mapping for dynamic buttons, but advanced users may wish to read deeper into the module to build customized buttons and workflows.

### callStatusNumber variable meaning

When joining flow is 1 = Connecting, 8 = Audio Ready, 3 = Connected.

When leaving flow is 4 = Disconnected, 7 = Ended.

> Note: If module is restarted while in a meeting 0 = Not In meeting and 1 = In Meeting
