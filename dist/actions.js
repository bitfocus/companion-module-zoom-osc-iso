"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActions = void 0;
const command = require('./osccommands').commands;
function getActions(instance) {
    /**
     * @param action Action callback object
     * @param _info Unused
     * @description Sends functions/params from actions that don't require complex logic
     */
    // Make list of users ready for Companion
    let CHOICES_USERS = [{ id: '', label: 'no users' }];
    if (instance.ZoomUserData.length !== 0) {
        CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
            id: id.zoomId.toString(),
            label: id.username,
        }));
    }
    const sendUserActionCommand = (action, _info) => {
        // Construct command
        let oscPath = `/zoom/zoomID${action.options.command}`;
        let args = action.options.user;
        if (instance.OSC)
            instance.OSC.sendCommand(oscPath, args);
    };
    const sendGlobalActionCommand = (action, _info) => {
        // Construct command
        let oscPath = action.options.command;
        if (instance.OSC)
            instance.OSC.sendCommand(oscPath);
    };
    return {
        // User Actions
        Pin: {
            label: 'Pin User',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: CHOICES_USERS.find(element => element !== undefined) ? CHOICES_USERS.find(element => element !== undefined).id : 'no user yet',
                    choices: CHOICES_USERS,
                },
            ],
            callback: (action) => {
                const Pin = {
                    id: 'Pin',
                    options: {
                        user: action.options.user,
                        command: command.Pin,
                    },
                };
                sendUserActionCommand(Pin);
            },
        },
        AddPin: {
            label: 'Add Pin',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: CHOICES_USERS.find(element => element !== undefined) ? CHOICES_USERS.find(element => element !== undefined).id : 'no user yet',
                    choices: CHOICES_USERS,
                },
            ],
            callback: (action) => {
                const AddPin = {
                    id: 'AddPin',
                    options: {
                        user: action.options.user,
                        command: command.AddPin,
                    },
                };
                sendUserActionCommand(AddPin);
            },
        },
        Mute: {
            label: 'Mute user',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: CHOICES_USERS.find(element => element !== undefined) ? CHOICES_USERS.find(element => element !== undefined).id : 'no user yet',
                    choices: CHOICES_USERS,
                },
            ],
            callback: (action) => {
                const Mute = {
                    id: 'Mute',
                    options: {
                        user: { type: 'i', value: action.options.user },
                        command: command.Mute,
                    },
                };
                sendUserActionCommand(Mute);
            },
        },
        Unmute: {
            label: 'Unmute user',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: CHOICES_USERS.find(element => element !== undefined) ? CHOICES_USERS.find(element => element !== undefined).id : 'no user yet',
                    choices: CHOICES_USERS,
                },
            ],
            callback: (action) => {
                const Unmute = {
                    id: 'Unmute',
                    options: {
                        user: { type: 'i', value: action.options.user },
                        command: command.Unmute,
                    },
                };
                sendUserActionCommand(Unmute);
            },
        },
        // Global actions
        EnableUsersUnmute: {
            label: 'Enable Users to Unmute',
            options: [],
            callback: () => {
                const EnableUsersToUnmute = {
                    id: 'EnableUsersUnmute',
                    options: {
                        command: command.EnableUsersToUnmute,
                    },
                };
                sendGlobalActionCommand(EnableUsersToUnmute);
            },
        },
    };
}
exports.getActions = getActions;
