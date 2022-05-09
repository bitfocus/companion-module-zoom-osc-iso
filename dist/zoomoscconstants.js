var enums = {
    // enum {
    SubscribeModeNone: 0,
    SubscribeModeTargetList: 1,
    SubscribeModeAll: 2,
    SubscribeModePanelists: 3,
    SubscribeModeOnlyGallery: 4,
    // ZOSCSubscribeMode;
    // enum {
    GalleryTrackModeTargetIndex: 0,
    GalleryTrackModeZoomID: 1,
    GalleryTrackModeTargetIndexList: 2,
    GalleryTrackModeZoomIDList: 3,
    // ZOSCGalleryTrackMode;
    // enum {
    Host_Mode_None: 0,
    Host_ForOtherUsers: 1,
    Host_Always: 2,
    Host_FullHost: 3,
    // ZOSCRequireHostMode;
    // enum {
    RemoteControl_Disabled: 0,
    RemoteControl_OnlyTargets: 1,
    RemoteControl_Panelists: 2,
    RemoteControl_AllUsers: 3,
    // ZOSCChatControlTransmitMode;
    // enum {
    AllowRemote_Disabled: 0,
    AllowRemote_Named: 1,
    AllowRemote_CoHost: 2,
    AllowRemote_All: 3,
    // ZOSCChatControlReceiveMode;
};
/**
 Create an action which will be run on the last part of an OSC (non user  message (/zoom/../ACTION

 @param messagePart The OSC message part to be matched (case insensitive
 @param title The title of the message (human readable
 @param isPro An action that requires a pro license to function
 @param isNDI An Action that only functions with zoomNDI
 @param requireCoHost The hostMode required for the action to be run
 @param description Human readable description
 @return The completed struct
 */
/*
NS_INLINE ZOSCLastPartMessageMatch : {const char *messagePart, const char* title, bool isPro, bool isNDI, ZOSCRequireHostMode requireCoHost, int argCount, const char *description  {
        ZOSCLastPartMessageMatch m;
        m.messagePart : messagePart;
        m.title : title;
        m.isPro : isPro;
        m.isNDI : isNDI;
        m.requireCoHost : requireCoHost;
        m.description : description;
        return m;
//

//else
 : {a, b, c, d, e, f, g  : {a, b, c, d, e, false, false, 1, f, g
//endif


// struct {
        const char *messagePart;
        const char *title;
        bool isPro;
        bool isNDI;
        ZOSCRequireHostMode requireCoHost;
        bool mustForward;
        bool preferForward;
        int maxGroupSize;
        int argCount;
        const char *description;
// ZOSCUserLastPartMessageMatch;
"*/
/**
 Create a struct for an action on the final part of a user OSC message (/zoom/../../PART

 @param messagePart The OSC message part to be matched (case insensitive
 @param title The title of the message (human readable
 @param isPro An action that requires a pro license to function
 @param isNDI An Action that only functions with zoomNDI
 @param requireCoHost The hostMode required for the action to be run
 @param mustForward Whether the action must be forwarded (by chat or similar  to act on a remote user
 @param preferForward Whether the action prefers to forward to a remote user (but can act locally if required
 @param maxGroupSize The maximum group size that the action can act on (or -1 for infinite
 @param description The (human readable  description of the message
 @return A completed struct
 */
/*
NS_INLINE ZOSCUserLastPartMessageMatch : {const char *messagePart, const char* title, bool isPro, bool isNDI, ZOSCRequireHostMode requireCoHost, bool mustForward, bool preferForward, int maxGroupSize, int argCount, const char *description  {
        ZOSCUserLastPartMessageMatch m;
        m.messagePart : messagePart;
        m.title : title;
        m.isPro : isPro;
        m.requireCoHost : requireCoHost;
        m.mustForward : mustForward;
        m.preferForward : preferForward;
        m.maxGroupSize : maxGroupSize;
        m.argCount : argCount;
        m.description : description;
        return m;
//

 : {a, b, c, d, e, f, g, h, i, j, ...  : {a, b, c, d, e, f, g, h, i, j

"*/
var keywords = {
    ZOSC_MSG_PART_ZOOM: "zoom",
    ZOSC_MSG_PART_ZOOMOSC: "zoomosc",
    ZOSC_MSG_PART_USER: "user",
    //message target types
    ZOSC_MSG_PART_ME: "me",
    ZOSC_MSG_TARGET_PART_GALINDEX: "galIndex",
    ZOSC_MSG_TARGET_PART_ZOOMID: "zoomID",
    ZOSC_MSG_TARGET_PART_TARGET: "targetID",
    ZOSC_MSG_TARGET_PART_USERNAME: "userName",
    ZOSC_MSG_TARGET_PART_GALLERY_POSITION: "galleryPosition",
    ZOSC_MSG_TARGET_PART_SELECTION: "selection",
    //message grouping types
    ZOSC_MSG_GROUP_PART_ALL: "all",
    ZOSC_MSG_GROUP_PART_TRACKED: "tracked",
    ZOSC_MSG_GROUP_PART_PANELISTS: "panelists",
    ZOSC_MSG_GROUP_PART_ATTENDEES: "attendees",
    //users takes multiple args similar to Except (below
    ZOSC_MSG_GROUP_PART_USERS: "users",
    //except messages MUST end with Except
    ZOSC_MSG_EXCLUDE_PART_EXCEPT: "Except",
    ZOSC_MSG_EXCLUDE_PART_ALL_EXCEPT: "allExcept",
    ZOSC_MSG_EXCLUDE_PART_TRACKED_EXCEPT: "trackedExcept",
    ZOSC_MSG_EXCLUDE_PART_PANELISTS_EXCEPT: "panelistsExcept",
    ZOSC_MSG_EXCLUDE_PART_ATTENDEES_EXCEPT: "attendeesExcept",
};
var actions = {
    //user action address parts
    //in the form /zoom[/galIndex | /zoomID]/{msg_part// {int INDEX | int galIndex | int zoomID | string userName//
    //SCREEN 1 PIN MESSAGES
    PIN_GROUP: { TITLE: "pins", ARGS: "", DESCRIPTION: "Select user to pin/upPin", MESSAGES: {
            ZOSC_MSG_PART_PIN: { USER_ACTION: "pin", TITLE: "Pin screen 1", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Pin a single user to screen 1, unpinning others first" },
            ZOSC_MSG_PART_ADD_PIN: { USER_ACTION: "addPin", TITLE: "Add Pin screen 1", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 9, ARG_COUNT: 0, DESCRIPTION: "Add user(s  to pinned users on screen 1" },
            ZOSC_MSG_PART_UNPIN: { USER_ACTION: "unPin", TITLE: "Un-Pin screen 1", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "UnPin selected user from screen 1" },
            ZOSC_MSG_PART_CLEAR_PIN: { GENERAL_ACTION: "clearPin", TITLE: "Clear pinned screen 1", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Clear all pinned users from scren 1" },
            ZOSC_MSG_PART_TOGGLE_PIN: { USER_ACTION: "togglePin", TITLE: "Toggle Pin user on screen 1", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Toggle Pin selected user from screen 1" },
            //SCREEN 2 PIN MESSAGES
            ZOSC_MSG_PART_PIN2: { USER_ACTION: "pin2", TITLE: "Pin screen 2", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Pin a single user to screen 3, unpinning others first" },
            // ZOSC_MSG_PART_ADD_PIN2 : {USER_ACTION:"addPin2", TITLE:"Add Pin screen 2", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 9, ARG_COUNT: 0, DESCRIPTION: "Add user(s  to pinned users on screen 2" },
            ZOSC_MSG_PART_UNPIN2: { USER_ACTION: "unPin2", TITLE: "Un-Pin screen 2", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "UnPin selected user from screen 2" },
            ZOSC_MSG_PART_CLEAR_PIN2: { GENERAL_ACTION: "clearPin2", TITLE: "Clear pinned screen 2", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Clear all pinned users from scren 2" },
            ZOSC_MSG_PART_TOGGLE_PIN2: { USER_ACTION: "togglePin2", TITLE: "Toggle Pin screen 2", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Toggle Pin selected user from screen 2" }
        } },
    REMOTE_PIN_GROUP: { TITLE: "remote pins", ARGS: "string:Username to Pin", DESCRIPTION: "Select user to pin/upPin on remote device", MESSAGES: {
            //SCREEN 1 REMOTE PIN MESSAGES
            //**NOTE THAT REMOTE PIN MESSAGES SHOULD NOT FORWARD AS THEY NEED TO BE SWIZZLED LOCALLY BEFORE BEING SENT ON..**
            ZOSC_MSG_PART_REMOTE_PIN: { USER_ACTION: "remotePin", TITLE: "Pin screen 1 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Pin a single user to screen 1, unpinning others first on a remote client. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_ADD_PIN: { USER_ACTION: "remoteAddPin", TITLE: "Add Pin screen 1 on a remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Add user to pinned users on screen 1 on a remote client. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_UNPIN: { USER_ACTION: "remoteUnPin", TITLE: "Un-Pin screen 1 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "UnPin selected user from screen 1. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_CLEAR_PIN: { USER_ACTION: "remoteClearPin", TITLE: "Clear pinned screen 1 on remote user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Clear all pinned users from scren 1. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_TOGGLE_PIN: { USER_ACTION: "remoteTogglePin", TITLE: "Toggle Pin screen 1 for remote user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Toggle Pin selected user for remote user on screen 1" },
            //SCREEN 2 PIN MESSAGES
            ZOSC_MSG_PART_REMOTE_PIN2: { USER_ACTION: "remotePin2", TITLE: "Pin screen 2 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Pin a single user to screen 3, unpinning others first on remote client. Takes one additional final string argument with the userName of the user to pin" },
            // ZOSC_MSG_PART_REMOTE_ADD_PIN2 : {USER_ACTION:"remoteAddPin2", TITLE:"Add Pin screen 2 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Add user to pinned users on screen 2 on remote client. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_UNPIN2: { USER_ACTION: "remoteUnPin2", TITLE: "Un-Pin screen 2 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "UnPin selected user from screen 2. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_CLEAR_PIN2: { USER_ACTION: "remoteClearPin2", TITLE: "Clear pinned screen 2 on remote client", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Clear all pinned users from screen 2. Takes one additional final string argument with the userName of the user to pin" },
            ZOSC_MSG_PART_REMOTE_TOGGLE_PIN2: { USER_ACTION: "remoteTogglePin2", TITLE: "Toggle Pin screen 2 for remote user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Toggle Pin selected user for remote user on screen 2" }
        } },
    SPOTLIGHT_GROUP: { TITLE: "Spotlight", ARGS: "", DESCRIPTION: "Select user to spotlight", MESSAGES: {
            //SPOTLIGHT MESSAGES
            ZOSC_MSG_PART_SPOT: { USER_ACTION: "spot", TITLE: "Spotlight user", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Spotlight sent user, replacing any existing spotlight user(s " },
            ZOSC_MSG_PART_ADD_SPOT: { USER_ACTION: "addSpot", TITLE: "Add to spotlight user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 9, ARG_COUNT: 0, DESCRIPTION: "Add selected user(s  to spotlight" },
            ZOSC_MSG_PART_UNSPOT: { USER_ACTION: "unSpot", TITLE: "Unspotlight user", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Unspotlight selected user(s " },
            ZOSC_MSG_PART_TOGGLE_SPOT: { USER_ACTION: "toggleSpot", TITLE: "Toggle spotlight for user", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Toggle spotlight for selected user(s " },
            ZOSC_MSG_PART_CLEAR_SPOTLIGHT: { MESSAGE: "/zoom/clearSpot", TITLE: "Clear spotlight", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, ARG_COUNT: 0, DESCRIPTION: "Clearing all users from spotlight" }
        } },
    AV_GROUP: { TITLE: "Audio/video actions", ARGS: "", DESCRIPTION: "Change audio/video status for user", MESSAGES: {
            //Video/audio on/off
            ZOSC_MSG_PART_VIDON: { USER_ACTION: "videoOn", TITLE: "Video on", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: true, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Turn video on for selected user(s " },
            ZOSC_MSG_PART_VIDOFF: { USER_ACTION: "videoOff", TITLE: "Video off", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: true, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Turn video off for selected user(s " },
            ZOSC_MSG_PART_TOGGLE_VIDEO: { USER_ACTION: "toggleVideo", TITLE: "Toggle video", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: true, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Toggle video for selected user(s " },
            ZOSC_MSG_PART_MUTE: { USER_ACTION: "mute", TITLE: "Mute Audio", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Mute audio for selected user(s " },
            ZOSC_MSG_PART_UNMUTE: { USER_ACTION: "unMute", TITLE: "UnMute audio", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: true, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Un-Mute audio for selected user(s " },
            ZOSC_MSG_PART_TOGGLE_MUTE: { USER_ACTION: "toggleMute", TITLE: "Toggle  audio", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: true, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Toggle mute audio for selected user(s " },
            ZOSC_MSG_UNMUTE_ALL: { MESSAGE: "/zoom/all/unMute", TITLE: "UnMute all", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, ARG_COUNT: 0, DESCRIPTION: "UnMute All users (except self " },
            ZOSC_MSG_ENABLE_USERS_CAN_UNMUTE: { MESSAGE: "/zoom/enableUsersUnmute", TITLE: "Enable users unMute", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, ARG_COUNT: 0, DESCRIPTION: "Enable users can unmute" },
            ZOSC_MSG_DISABLE_USERS_CAN_UNMUTE: { MESSAGE: "/zoom/disableUsersUnmute", TITLE: "Disable users unMute", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, ARG_COUNT: 0, DESCRIPTION: "Disable users can unmute" },
            ZOSC_MSG_MUTE_ALL: { MESSAGE: "/zoom/all/mute", TITLE: "Mute All", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Mute all users (except self " }
        } },
    CHAT_GROUP: { TITLE: "Chat", ARGS: "string:Message to send", DESCRIPTION: "Set chat to remote user", MESSAGES: {
            ZOSC_MSG_PART_CHAT: { USER_ACTION: "chat", TITLE: "Send Chat Message", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Send chat message to selected user(s " },
            ZOSC_MSG_CHAT_ALL: { MESSAGE: "/zoom/chatAll", TITLE: "Chat All", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 1, DESCRIPTION: "Chat Everyone" }
        } },
    REMOTE_CHAT_GROUP: { TITLE: "Remote chat", ARGS: "string: Target User, string: Message to send", DESCRIPTION: "Send message to user from remote user", MESSAGES: {
            ZOSC_MSG_PART_REMOTE_CHAT: { USER_ACTION: "remoteChat", TITLE: "Send Chat Message from remote user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 2, DESCRIPTION: "Send chat message to selected user(s  from remote client" }
        } },
    HAND_GROUP: { TITLE: "Raise/lower hand actions", ARGS: "", DESCRIPTION: "raise/lower hands for user(s ", MESSAGES: {
            //hands
            ZOSC_MSG_PART_RAISEHAND: { USER_ACTION: "raiseHand", TITLE: "Raise Hand", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Raise selected user('s  hand(s " },
            ZOSC_MSG_PART_LOWERHAND: { USER_ACTION: "lowerHand", TITLE: "Lower Hand", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Lower selected user('s  hand(s " },
            ZOSC_MSG_PART_TOGGLE_HAND: { USER_ACTION: "toggleHand", TITLE: "Toggle Hand", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Toggle selected user('s  hand(s " },
            ZOSC_MSG_LOWER_ALL_HANDS: { MESSAGE: "/zoom/lowerAllHands", TITLE: "Lower all hands", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, ARG_COUNT: 0, DESCRIPTION: "Lower all users hands"
            }
        } },
    ROLE_GROUP: { TITLE: "Role Actions", ARGS: "", DESCRIPTION: "Change role for user", MESSAGES: {
            //role changed
            ZOSC_MSG_PART_MAKE_HOST: { USER_ACTION: "makeHost", TITLE: "Make user host", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_FullHost, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Make selected user host" },
            ZOSC_MSG_PART_MAKE_CO_HOST: { USER_ACTION: "makeCoHost", TITLE: "Make co-host", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Make selected user co-host" },
            ZOSC_MSG_PART_REVOKE_CO_HOST: { USER_ACTION: "revokeCoHost", TITLE: "Revoke Co-Host", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Revoke co-host from selected user" },
            ZOSC_MSG_PART_RECLAIM_HOST: { USER_ACTION: "reclaimHost", TITLE: "Reclaim host", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Reclaim host" },
            ZOSC_MSG_PART_MAKE_PANELIST: { USER_ACTION: "makePanelist", TITLE: "Make Panelist", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Promote selected user(s  to panelist (webinar only " },
            ZOSC_MSG_PART_MAKE_ATTENDEE: { USER_ACTION: "makeAttendee", TITLE: "Make attendee", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Demote selected user(s  to attendee (webinar only " },
            ZOSC_MSG_PART_EJECT: { USER_ACTION: "eject", TITLE: "Eject user(s ", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Always, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Eject selected user(s  from meeting" }
        } },
    RENAME_GROUP: { TITLE: "Rename Action", ARGS: "string:New Name", DESCRIPTION: "Change name (requires host or cohost)", MESSAGES: {
            ZOSC_MSG_PART_RENAME: { USER_ACTION: "rename", TITLE: "Rename user", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_ForOtherUsers, MUST_FORWARD: false, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Rename the selected user" },
        } },
    BREAKOUT_GROUP: { TITLE: "Breakout Room Actions", ARGS: "", DESCRIPTION: "Breakout room actions", MESSAGES: {
            ZOSC_MSG_LIST_BREAKOUTS: { MESSAGE: "/zoom/listBreakouts", TITLE: "List breakout rooms", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_FullHost, ARG_COUNT: 0, DESCRIPTION: "List all available breakout rooms" },
            ZOSC_MSG_LIST_CREATE_BREAKOUT: { MESSAGE: "/zoom/createBreakout", TITLE: "Create breakout room", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_FullHost, ARG_COUNT: 1, DESCRIPTION: "Create new breakout room" }
        } },
    SCREENSHARE_GROUP: { TITLE: "Screenshare actions", ARGS: "string:ID/name of screen or window", DESCRIPTION: "start/stop screenshare for user", MESSAGES: {
            //screenshare
            ZOSC_MSG_PART_SCREENSHARE: { USER_ACTION: "startScreenShare", TITLE: "Start screen share", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Start screen share for selected user and sent screen" },
            ZOSC_MSG_PART_SCREENSHARE_PRIMARY: { USER_ACTION: "startScreenSharePrimary", TITLE: "Start screen share of primary display", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Start screen share for selected user and primary screen" },
            ZOSC_MSG_PART_WINDOWSHARE: { USER_ACTION: "startWindowShare", TITLE: "Start window share", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Start window share for selected user and sent screen" },
            ZOSC_MSG_PART_START_AUDIOSHARE: { USER_ACTION: "startAudioShare", TITLE: "Start audio share", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Start audio share for selected user " },
            ZOSC_MSG_PART_START_CAMERASHARE: { USER_ACTION: "startCameraShare", TITLE: "Start camera share", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Start camera share for selected user " },
            ZOSC_MSG_PART_SHARE_NEXT_CAMERA: { USER_ACTION: "shareNextCamera", TITLE: "Share next camera", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Share next camera" },
            ZOSC_MSG_PART_STOPSHARE: { USER_ACTION: "stopShare", TITLE: "Stop screenshare", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "Stop screenshare for selected user" },
            ZOSC_MSG_PART_LIST_WINDOWS: { USER_ACTION: "listWindows", TITLE: "List windows", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List available windows to screenshare for user(s " },
            ZOSC_MSG_PART_LISTSCREEN: { USER_ACTION: "listScreens", TITLE: "List screens you can share", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 0, DESCRIPTION: "List screens you can share" }
        } },
    VIEW_GROUP: { TITLE: "App actions", ARGS: "", DESCRIPTION: "Change app state for user", MESSAGES: {
            //general zoom control messages
            ZOSC_MSG_PART_VIEW_GALLERY: { USER_ACTION: "setGalleryView", TITLE: "Gallery view", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Switch selected user(s  to gallery view" },
            ZOSC_MSG_PART_GALLERY_PAGE_NEXT: { USER_ACTION: "galleryPageNext", TITLE: "Gallery page next", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Move to next page of gallery view (if available " },
            ZOSC_MSG_PART_GALLERY_PAGE_PREV: { USER_ACTION: "galleryPagePrev", TITLE: "Gallery page previous", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Move to previous page of gallery view (if available " },
            ZOSC_MSG_PART_VIEW_SPEAKER: { USER_ACTION: "setSpeakerView", TITLE: "Speaker view", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Switch selected user(s  to speaker view" },
            ZOSC_MSG_PART_SHOW_NON_VIDEO: { USER_ACTION: "showNonVideoParticipants", TITLE: "Show Non Video Participants", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Show non-video participants in gallery view" },
            ZOSC_MSG_PART_HIDE_NON_VIDEO: { USER_ACTION: "hideNonVideoParticipants", TITLE: "Hide Non Video Participants", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Hide non-video participants in gallery view" },
            // ZOSC_MSG_PART_SHOW_SELF_VIEW : {USER_ACTION:"showSelfView", TITLE:"Show self view", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Show Self View" },
            // ZOSC_MSG_PART_HIDE_SELF_VIEW : {USER_ACTION:"hideSelfView", TITLE:"hide self view", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Hide Self View" },
            ZOSC_MSG_PART_SHOW_USERNAMES: { USER_ACTION: "showUserNames", TITLE: "Show Usernames", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Show usernames on video feeds" },
            ZOSC_MSG_PART_HIDE_USERNAMES: { USER_ACTION: "hideUserNames", TITLE: "Hide Usernames", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Hide usernames on video feeds" },
            //zoom setting message parts
            ZOSC_MSG_PART_SET_ENABLE_ORIGINAL_SOUND: { USER_ACTION: "enableOriginalSound", TITLE: "Enable original sound", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Enable original sound for user(s " },
            ZOSC_MSG_PART_SET_DISABLE_ORIGINAL_SOUND: { USER_ACTION: "disableOriginalSound", TITLE: "Disable original sound", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Disable orginal sound for user(s " },
            ZOSC_MSG_PART_SET_ENABLE_HD_VIDEO: { USER_ACTION: "enableHDVideo", TITLE: "Enable HD Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Enable HD video " },
            ZOSC_MSG_PART_SET_DISABLE_HD_VIDEO: { USER_ACTION: "disableHDVideo", TITLE: "Disable HD Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Disable HD video " },
            ZOSC_MSG_PART_SET_ENABLE_MIRROR_VIDEO: { USER_ACTION: "enableMirrorVideo", TITLE: "Enable Mirror Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Enable Mirror video " },
            ZOSC_MSG_PART_SET_DISABLE_MIRROR_VIDEO: { USER_ACTION: "disableMirrorVideo", TITLE: "Disable Mirror Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Disable Mirror video " },
            ZOSC_MSG_PART_SET_ENABLE_OPTIMIZE_VIDEO: { USER_ACTION: "enableOptimizeVideo", TITLE: "Enable Optimized Share for Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Enable video playback optimization when sharing" },
            ZOSC_MSG_PART_SET_DISABLE_OPTIMIZE_VIDEO: { USER_ACTION: "disableOptimizeVideo", TITLE: "Disable Optimized Share for Video", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Disable video playback optimization when sharing" },
            ZOSC_MSG_PART_SET_ENABLE_COMPUTER_SOUND_WHEN_SHARING: { USER_ACTION: "enableComputerSoundWhenSharing", TITLE: "Enable share computer sound when sharing", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Enable share computerSoundWhenSharing" },
            ZOSC_MSG_PART_SET_DISABLE_COMPUTER_SOUND_WHEN_SHARING: { USER_ACTION: "disableComputerSoundWhenSharing", TITLE: "Disable share computer sound when sharing", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Disable share computerSoundWhenSharing" }
        } },
    SETTINGS_GROUP: { TITLE: "Settings action", ARGS: "string:Device ID or Index", DESCRIPTION: "Settings actions for user", MESSAGES: {
            ZOSC_MSG_PART_LIST_MIC_DEVICES: { USER_ACTION: "listMicDevices", TITLE: "List mic devices", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List mic devices for user(s " },
            ZOSC_MSG_PART_SET_MIC_DEVICE: { USER_ACTION: "setMicDevice", TITLE: "Set mic device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set mic device for user(s ", LIST_SOURCE: "micDevices", LIST_GET: "listMicDevices", VALUE_GET: "getMicDevice", VALUE_SOURCE: "micDevice", IS_DUPEL: true },
            ZOSC_MSG_PART_LIST_SPEAKER_DEVICES: { USER_ACTION: "listSpeakerDevices", TITLE: "List speaker devices", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List speaker devices for user(s " },
            ZOSC_MSG_PART_SET_SPEAKER_DEVICE: { USER_ACTION: "setSpeakerDevice", TITLE: "Set speaker device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set speaker device for user(s ", LIST_SOURCE: "speakerDevices", LIST_GET: "listSpeakerDevices", VALUE_GET: "getSpeakerDevice", VALUE_SOURCE: "speakerDevice", IS_DUPEL: true },
            ZOSC_MSG_PART_GET_MIC_VOLUME: { USER_ACTION: "getMicLevel", TITLE: "Get mic volume", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get mic volume for user(s " },
            ZOSC_MSG_PART_SET_MIC_VOLUME: { USER_ACTION: "setMicLevel", TITLE: "Set mic volume", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set mic volume for user(s ", VALUE_GET: "getMicVolume", VALUE_SOURCE: "micVolume" },
            ZOSC_MSG_PART_GET_SPEAKER_VOLUME: { USER_ACTION: "getSpeakerVolume", TITLE: "Get speaker volume", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get speaker volume for user(s " },
            ZOSC_MSG_PART_SET_SPEAKER_VOLUME: { USER_ACTION: "setSpeakerVolume", TITLE: "Set speaker volume", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set speaker volume for user(s ", VALUE_GET: "getSpeakerVolume", VALUE_SOURCE: "speakerVolume" },
            ZOSC_MSG_PART_LIST_CAMERA_DEVICES: { USER_ACTION: "listCameraDevices", TITLE: "List Camera devices", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List camera devices for user(s " },
            ZOSC_MSG_PART_SET_CAMERA_DEVICE: { USER_ACTION: "setCameraDevice", TITLE: "Set camera device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set camera device for user(s ", LIST_SOURCE: "cameraDevices", LIST_GET: "listCameraDevices", VALUE_GET: "getCameraDevice", VALUE_SOURCE: "cameraDevice", IS_DUPEL: true },
            ZOSC_MSG_PART_LIST_BACKGROUNDS: { USER_ACTION: "listBackgrounds", TITLE: "List Backgrounds", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List Backgrounds for user(s " },
            ZOSC_MSG_PART_SET_BACKGROUND: { USER_ACTION: "setBackground", TITLE: "Set background", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 1, DESCRIPTION: "Set background for user(s ", LIST_SOURCE: "backgrounds", LIST_GET: "listBackgrounds", VALUE_GET: "getBackground", VALUE_SOURCE: "background" },
            /*
             ZOSC_MSG_PART_LIST_VIDEO_FILTERS : {USER_ACTION:"listVideoFilters", TITLE:"List video filters", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "List video filters for user(s " },
            
             ZOSC_MSG_PART_SET_VIDEO_FILTER : {USER_ACTION:"setVideoFilter", TITLE:"Set video filter", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Set video filter for user(s ", LIST_SOURCE: "videoFilters", LIST_GET: "listVideoFilters", VALUE_GET: "getVideoFilter", VALUE_SOURCE: "videoFilter" },
            */
            ZOSC_MSG_PART_GET_CAMERA_DEVICE: { USER_ACTION: "getCameraDevice", TITLE: "Get Camera Device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get current camera device for user(s " },
            ZOSC_MSG_PART_GET_MIC_DEVICE: { USER_ACTION: "getMicDevice", TITLE: "Get Mic device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get current mic device for user(s " },
            ZOSC_MSG_PART_GET_SPEAKER_DEVICE: { USER_ACTION: "getSpeakerDevice", TITLE: "Get Speaker Device", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get current speaker device for user(s " },
            ZOSC_MSG_PART_GET_BACKGROUND: { USER_ACTION: "getBackground", TITLE: "Get Background", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Get current virtual background for user(s " }
            // ZOSC_MSG_PART_GET_VIDEO_FILTER : {USER_ACTION:"getVideoFilter", TITLE:"Get video filter", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: 1, ARG_COUNT: 1, DESCRIPTION: "Get current video filter for user(s " }
        } },
    SELECTION_GROUP: { TITLE: "Selection Actions", ARGS: "", DESCRIPTION: "Select users for batch actions", MESSAGES: {
            ZOSC_MSG_PART_LIST_ADD_SELECTION: { INTERNAL_ACTION: "addSelection", TITLE: "Add to Selection", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Add user(s to selection group" },
            ZOSC_MSG_PART_LIST_REMOVE_SELECTION: { INTERNAL_ACTION: "removeSelection", TITLE: "Remove from Selection", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Remove user(s from selection group" },
            ZOSC_MSG_PART_LIST_TOGGLE_SELECTION: { INTERNAL_ACTION: "toggleSelection", TITLE: "Toggle Selection", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Adds user if not present, removes user if already present" },
            ZOSC_MSG_PART_LIST_SINGLE_SELECTION: { INTERNAL_ACTION: "singleSelection", TITLE: "Single Selection", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Adds user and toggles all other users off" },
            ZOSC_MSG_PART_LIST_CLEAR_SELECTION: { INTERNAL_ACTION: "clearSelection", TITLE: "Clear Selection", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 0, DESCRIPTION: "Clear all users in selection group" },
        } },
    APP_ACTION_GROUP: { TITLE: "General local Application Actions", ARGS: "", DESCRIPTION: "Settings actions for user", MESSAGES: {
            //memory control messages
            /**
             pings the zoomOSC client. Client will replay with /zoomosc/pong
             one (optional  argument of type any which is simply returned with the pong message
             **/
            ZOSC_MSG_PING: { MESSAGE: "/zoom/ping", TITLE: "Ping client", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 1, DESCRIPTION: "Send ping to application" },
            ZOSC_MSG_SUBSCRIBE: { MESSAGE: "/zoom/subscribe", TITLE: "Subscribe", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 1, DESCRIPTION: "Subscribe for updates" },
            ZOSC_MSG_GETORDER: { MESSAGE: "/zoom/getOrder", TITLE: "get the order", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "get the order" },
            ZOSC_MSG_UPDATE: { MESSAGE: "/zoom/update", TITLE: "Update", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Update Targets List" },
            ZOSC_MSG_INCLUDE: { MESSAGE: "/zoom/include", TITLE: "Include", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Perform Include" },
            ZOSC_MSG_GALTRACK_MODE: { MESSAGE: "/zoom/galTrackMode", TITLE: "Set gallery tracking mode", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 1, DESCRIPTION: "Set Gallery Tracking Mode" },
            ZOSC_MSG_GALCOUNT: { MESSAGE: "/zoom/galCount", TITLE: "Get gallery count", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Get Gallery Cout" },
            ZOSC_MSG_LOAD: { MESSAGE: "/zoom/load", TITLE: "Load", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 1, DESCRIPTION: "Load " },
            ZOSC_MSG_SAVE: { MESSAGE: "/zoom/save", TITLE: "Save", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Save to disk" },
            ZOSC_MSG_LIST: { MESSAGE: "/zoom/list", TITLE: "List", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "List" },
            ZOSC_MSG_RESET: { MESSAGE: "/zoom/reset", TITLE: "reset", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Reset ZoomOSC" },
            //ACTIONS TO ALL USERS - these override any clever iterating and are direct calls to API
            //meeting control actions
            ZOSC_MSG_LEAVE_MEETING: { MESSAGE: "/zoom/leaveMeeting", TITLE: "Leave meeting", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "Leave Meeting" },
            ZOSC_MSG_END_MEETING: { MESSAGE: "/zoom/endMeeting", TITLE: "End Meeting", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_FullHost, ARG_COUNT: 0, DESCRIPTION: "End Meeting For All" },
        } },
    ISO_ACTION_GROUP: { TITLE: "ZoomISO Actions", ARGS: "int:Custom Output Number", DESCRIPTION: "ZoomISO Specific Actions", MESSAGES: {
            ZOSC_MSG_OUTPUT_ISO: { USER_ACTION: "/zoom/outputISO", TITLE: "Output ISO", ISPRO: false, ISNDI: true, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 2, DESCRIPTION: "Output ISO feeds" }
        } },
    JM_ACTION_GROUP: { TITLE: "Join Meeting", ARGS: 'string:Meeting Number, string:Meeting Password, string:Display name', DESCRIPTION: "Join a meeting in progress", MESSAGES: {
            ZOSC_MSG_JOIN_MEETING: { MESSAGE: "/zoom/joinMeeting", TITLE: "Join Meeting", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 3, DESCRIPTION: "Join Meeting" }
        }
    },
    WINDOW_FRAME_ACTION_GROUP: { TITLE: "Meeting window frame", ARGS: "int:x or width, int:y or height", DESCRIPTION: "Set meeting window size and position", MESSAGES: {
            ZOSC_MSG_PART_SET_WINDOW_POSITION: { USER_ACTION: "setWindowPosition", TITLE: "Set Window Position", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 2, DESCRIPTION: "Set meeting window position" },
            ZOSC_MSG_PART_SET_WINDOW_SIZE: { USER_ACTION: "setWindowSize", TITLE: "Set Window Size", ISPRO: true, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, MUST_FORWARD: true, PREFER_FORWARD: false, GROUP_SIZE: -1, ARG_COUNT: 2, DESCRIPTION: "Set meeting window size" }
        }
    }
};
//-------OUTPUT------
var outputFullMessages = {
    /**
     reply to ping message with arguments:
     0 - the argument which was sent to /ping, or 0 if no arg
     1 - string current zoomOSC version
     2 - the current subscribe mode
     3 - the current galTrack mode
     4 - the status of the client (0 : not in call, 1 : call in progress
     5 - the number of users in participant_list
     6 - the number of users on the call
     */
    ZOSC_MSG_SEND_PONG: { MESSAGE: "/zoomosc/pong", DESCRIPTION: "replying to a 'ping' message" },
    /**
     user output messages all take the following form for their initial arguments, they may then optionally have additional arguments following
     0 - index in participant list (or -1 if not there
     1 - the user's username
     2 - the user's index in the gallery (or -1 if not there
     3 - the user's zoom user ID
     */
    ZOSC_MSG_SEND_GALORDER: { MESSAGE: "/zoomosc/galleryOrder", DESCRIPTION: "sending the current gallery order" },
    ZOSC_MSG_SEND_GALCOUNT: { MESSAGE: "/zoomosc/galleryCount", DESCRIPTION: "sending the current gallery count" },
    ZOSC_MSG_SEND_GALSHAPE: { MESSAGE: "/zoomosc/galleryShape", DESCRIPTION: "sending the current gallery shape" },
    ZOSC_MSG_SEND_LIST_CLEAR: { MESSAGE: "/zoomosc/listCleared", DESCRIPTION: "subscription list has been cleared and is being resent" },
    ZOSC_MSG_SEND_CHATCONTROL_GREETING: { MESSAGE: "/zoom/greeting", TITLE: "Greeting", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "controlling client alerting users that it may control them" },
    ZOSC_MSG_SEND_CHATCONTROL_HELLO: { MESSAGE: "/zoom/hello", TITLE: "Hello", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "controlled client alerting users that it can be controlled" },
    ZOSC_MSG_SEND_CHATCONTROL_GOODBYE: { MESSAGE: "/zoom/goodbye", TITLE: "Goodbye", ISPRO: false, ISNDI: false, REQUIRE_HOST: enums.Host_Mode_None, ARG_COUNT: 0, DESCRIPTION: "controlled client alerting users that it can no longer be controlled" }
    //list message arguments are: (first 4 mirror normal emission
    //0 - current index
    //1 - User name
    //2 - gallery index (or -1 if not there
    //3 - zoomID
    //4 - total participant list size
    //5 - total size of list (so if subscribe is set to all will be number of people in call
    //6 - User Role
    //7 - Online status
    //8 - video status
    //9 - audio status
    //10 - handRaise status
};
var outputLastPartMessages = {
    //Following messages all send user info with the arguments
    //0 - current index
    //1 - User name
    //2 - gallery index (or -1 if not there
    //3 - zoomID
    ZOSC_MSG_SEND_PART_LIST: { MESSAGE: "list", DESCRIPTION: "sending list of user status's" },
    ZOSC_MSG_SEND_PART_CHAT: { MESSAGE: "chat", DESCRIPTION: "emitting a chat message received" },
    ZOSC_MSG_SEND_PART_USER_ONLINE: { MESSAGE: "online", DESCRIPTION: "emitting a user status change to Online" },
    ZOSC_MSG_SEND_PART_USER_OFFLINE: { MESSAGE: "offline", DESCRIPTION: "emitting a user status change to Offline" },
    ZOSC_MSG_SEND_PART_USER_ROLE_CHANGED: { MESSAGE: "roleChanged", DESCRIPTION: "user's role has changed" },
    ZOSC_MSG_SEND_PART_SOUND_ON: { MESSAGE: "unMute", DESCRIPTION: "Notification that user's audio has been unMuted" },
    ZOSC_MSG_SEND_PART_SOUND_OFF: { MESSAGE: "mute", DESCRIPTION: "Notification that user's audio has been muted" },
    ZOSC_MSG_SEND_PART_AUDIO_STATUS: { MESSAGE: "audioStatus", DESCRIPTION: "Notification that user's audio status has changed" },
    ZOSC_MSG_SEND_PART_VIDEO_ON: { MESSAGE: "videoOn", DESCRIPTION: "Notification that user's video has been turned on" },
    ZOSC_MSG_SEND_PART_VIDEO_OFF: { MESSAGE: "videoOff", DESCRIPTION: "Notification that user's video has been turned off" },
    ZOSC_MSG_SEND_PART_ACTIVE_SPEAKER: { MESSAGE: "activeSpeaker", DESCRIPTION: "Notification that user has become the 'active speaker'" },
    ZOSC_MSG_SEND_PART_SPOTLIGHT_ON: { MESSAGE: "spotlightOn", DESCRIPTION: "Notification that user has been added to spotlight" },
    ZOSC_MSG_SEND_PART_SPOTLIGHT_OFF: { MESSAGE: "spotlightOff", DESCRIPTION: "Notification that user has been removed from spotlight" },
    ZOSC_MSG_SEND_PART_HAND_RAISED: { MESSAGE: "handRaised", DESCRIPTION: "Notification that user's hand has raised" },
    ZOSC_MSG_SEND_PART_HAND_LOWERED: { MESSAGE: "handLowered", DESCRIPTION: "notification that user's hand has lowered" },
    ZOSC_MSG_SEND_PART_USERNAME_CHANGED: { MESSAGE: "userNameChanged", DESCRIPTION: "notification that user's username has changed" },
    ZOSC_MSG_SEND_PART_CAMERA_DEVICE_LIST: { MESSAGE: "cameraDevices", IS_LIST_SOURCE: true, DESCRIPTION: "List of available camera devices for user" },
    ZOSC_MSG_SEND_PART_MIC_DEVICE_LIST: { MESSAGE: "micDevices", IS_LIST_SOURCE: true, DESCRIPTION: "List of available mic devices for user" },
    ZOSC_MSG_SEND_PART_SPEAKER_DEVICE_LIST: { MESSAGE: "speakerDevices", IS_LIST_SOURCE: true, DESCRIPTION: "List of available speaker devices for user" },
    ZOSC_MSG_SEND_PART_BACKGROUND_LIST: { MESSAGE: "backgrounds", IS_LIST_SOURCE: true, DESCRIPTION: "List of available backgrounds for user" },
    // ZOSC_MSG_SEND_PART_VIDEO_FILTER_LIST : {MESSAGE: "videoFilters", IS_LIST_SOURCE: true, DESCRIPTION: "List of available video filter names for user" },
    ZOSC_MSG_SEND_PART_WINDOW_LIST: { MESSAGE: "windows", IS_LIST_SOURCE: true, DESCRIPTION: "List of available windows available to share by user" },
    ZOSC_MSG_SEND_PART_SCREEN_LIST: { MESSAGE: "screens", IS_LIST_SOURCE: true, DESCRIPTION: "List of available screens available to share by user" },
    ZOSC_MSG_SEND_PART_MIC_DEVICE: { MESSAGE: "micDevice", DESCRIPTION: "The current mic device for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_SPEAKER_DEVICE: { MESSAGE: "speakerDevice", DESCRIPTION: "The current mic device for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_CAMERA_DEVICE: { MESSAGE: "cameraDevice", DESCRIPTION: "The current camera device for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_BACKGROUND: { MESSAGE: "background", DESCRIPTION: "The current background for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_VIDEO_FILTER: { MESSAGE: "filter", DESCRIPTION: "The current videoFilter for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_MIC_VOLUME: { MESSAGE: "micVolume", DESCRIPTION: "The current mic volume for user", IS_VALUE_SOURCE: true },
    ZOSC_MSG_SEND_PART_SPEAKER_VOLUME: { MESSAGE: "speakerVolume", DESCRIPTION: "The current speaker volume for user", IS_VALUE_SOURCE: true }
};
if (module != undefined)
    module.exports = { enums, keywords, actions, outputLastPartMessages, outputFullMessages };
//endif /* ZOSCConstants_h */
