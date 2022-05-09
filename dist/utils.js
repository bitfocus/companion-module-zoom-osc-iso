"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.options = exports.rgb = exports.SOURCES = exports.TRANSITIONS = void 0;
// Static Variables
exports.TRANSITIONS = ['cut', 'auto'];
exports.SOURCES = ['IP1', 'IP2', 'IP3'];
/**
 * @param red 0-255
 * @param green 0-255
 * @param blue 0-255
 * @returns RGB value encoded for Companion Bank styling
 */
const rgb = (red, green, blue) => {
    return ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
};
exports.rgb = rgb;
/**
 * @description Common Action and Feedback options
 */
exports.options = {
    mute: {
        type: 'dropdown',
        label: 'Mute',
        id: 'mute',
        default: 0,
        choices: [
            { id: 0, label: 'unmute' },
            { id: 1, label: 'mute' },
        ],
    },
    video: {
        type: 'dropdown',
        label: 'Camera on/of',
        id: 'video',
        default: 0,
        choices: [
            { id: 0, label: 'off' },
            { id: 1, label: 'on' },
        ],
    },
    foregroundColor: {
        type: 'colorpicker',
        label: 'Foreground color',
        id: 'fg',
        default: (0, exports.rgb)(255, 255, 255),
    },
    foregroundColorBlack: {
        type: 'colorpicker',
        label: 'Foreground color',
        id: 'fg',
        default: (0, exports.rgb)(0, 0, 0),
    },
    backgroundColorPreview: {
        type: 'colorpicker',
        label: 'Background color when in preview',
        id: 'bg_pvw',
        default: (0, exports.rgb)(0, 255, 0),
    },
    backgroundColorProgram: {
        type: 'colorpicker',
        label: 'Background color when in grogram',
        id: 'bg',
        default: (0, exports.rgb)(255, 0, 0),
    },
    backgroundColorYellow: {
        type: 'colorpicker',
        label: 'Background color',
        id: 'bg',
        default: (0, exports.rgb)(255, 255, 0),
    },
};
/**
 * @param time Time in miliseconds or seconds
 * @param interval Interval of the time value - 'ms' or 's'
 * @param format String formatting - 'hh:mm:ss', 'hh:mm:ss.ms', 'mm:ss', or 'mm:ss.ms'
 * @returns Formated time string
 */
const formatTime = (time, interval, format) => {
    const timeMS = time * (interval === 'ms' ? 1 : 1000);
    const padding = (value) => (value < 10 ? '0' + value : value.toString());
    const hh = padding(Math.floor(timeMS / 360000));
    const mm = padding(Math.floor(timeMS / 60000) % 60);
    const ss = padding(Math.floor(timeMS / 1000) % 60);
    const ms = (timeMS % 1000) / 100;
    const result = `${format.includes('hh') ? `${hh}:` : ''}${mm}:${ss}${format.includes('ms') ? `.${ms}` : ''}`;
    return result;
};
exports.formatTime = formatTime;
