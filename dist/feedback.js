"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbacks = void 0;
const utils_1 = require("./utils");
function getFeedbacks(instance) {
    let CHOICES_USERS = [{ id: '', label: 'no users' }];
    if (instance.ZoomUserData.length !== 0) {
        CHOICES_USERS = instance.ZoomUserData.filter((n) => n).map((id) => ({
            id: id.zoomId.toString(),
            label: id.username,
        }));
    }
    return {
        microphoneMute: {
            type: 'advanced',
            label: 'Mute microphone',
            description: 'Indicates if a user has muted their microphone',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: instance.ZoomUserData.find((element) => element !== undefined)
                        ? instance.ZoomUserData.find((element) => element !== undefined).zoomId
                        : 'no user yet',
                    choices: CHOICES_USERS,
                },
                utils_1.options.mute,
                utils_1.options.foregroundColor,
                utils_1.options.backgroundColorProgram,
            ],
            callback: (feedback) => {
                if (instance.ZoomUserData[feedback.options.user].mute === (feedback.options.mute == 1 ? true : false))
                    return { color: feedback.options.fg, bgcolor: feedback.options.bg };
                else
                    return;
            },
        },
        camera: {
            type: 'advanced',
            label: 'Camera on/of',
            description: 'Indicates if camera is on or off',
            options: [
                {
                    type: 'dropdown',
                    label: 'User',
                    id: 'user',
                    default: instance.ZoomUserData.find((element) => element !== undefined)
                        ? instance.ZoomUserData.find((element) => element !== undefined).zoomId
                        : 'no user yet',
                    choices: CHOICES_USERS,
                },
                utils_1.options.video,
                utils_1.options.foregroundColor,
                utils_1.options.backgroundColorProgram,
            ],
            callback: (feedback) => {
                if (instance.ZoomUserData[feedback.options.user].videoOn === (feedback.options.video == 1 ? true : false))
                    return { color: feedback.options.fg, bgcolor: feedback.options.bg };
                else
                    return;
            },
        },
    };
}
exports.getFeedbacks = getFeedbacks;
