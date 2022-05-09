"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFields = void 0;
var SubscribeMode;
(function (SubscribeMode) {
    SubscribeMode[SubscribeMode["None"] = 0] = "None";
    SubscribeMode[SubscribeMode["TargetList"] = 1] = "TargetList";
    SubscribeMode[SubscribeMode["All"] = 2] = "All";
    SubscribeMode[SubscribeMode["Panelists"] = 3] = "Panelists";
    SubscribeMode[SubscribeMode["OnlyGallery"] = 4] = "OnlyGallery";
})(SubscribeMode || (SubscribeMode = {}));
const getConfigFields = () => {
    return [
        {
            type: 'textinput',
            id: 'host',
            label: 'Target host',
            width: 6,
            default: '127.0.0.1',
        },
        {
            type: 'number',
            id: 'tx_port',
            label: 'Sending port',
            width: 6,
            default: 9090,
            min: 1,
            max: 65535,
            step: 1,
        },
        {
            type: 'number',
            id: 'rx_port',
            label: 'Receive port',
            width: 6,
            default: 1234,
            min: 1,
            max: 65535,
            step: 1,
        },
        {
            type: 'dropdown',
            id: 'subscribeMode',
            label: 'Subscribe Mode',
            choices: [
                { id: SubscribeMode.None, label: 'None' },
                { id: SubscribeMode.TargetList, label: 'Target List' },
                { id: SubscribeMode.All, label: 'All' },
                { id: SubscribeMode.Panelists, label: 'Panelists' },
                { id: SubscribeMode.OnlyGallery, label: 'Only Gallery' },
            ],
            default: SubscribeMode.All,
            width: 6,
        },
        // {
        // 	type: 'dropdown',
        // 	id:	 'galTrackMode',
        // 	label: 'Gallery Tracking Mode ---ZOOMID MODE REQUIRED FOR GALLERY TRACKING FEATURES---',
        // 	choices:[
        // 		{id: ZOSC.enums.GalleryTrackModeTargetIndex, label: 'Target Index'},
        // 		{id: ZOSC.enums.GalleryTrackModeZoomID,			label: 'ZoomID'			}
        // 	],
        // 	default: ZOSC.enums.GalleryTrackModeZoomID,
        // 	width: 6
        // }
    ];
};
exports.getConfigFields = getConfigFields;
