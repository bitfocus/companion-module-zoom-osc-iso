"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSC = void 0;
const osc = require('osc');
class OSC {
    constructor(instance) {
        /**
         * @description Close connection on instance disable/removal
         */
        this.destroy = () => {
            if (this.udpPort)
                this.udpPort.Close();
            if (this.udpPort)
                this.udpPort.destroy();
        };
        /**
         * @description Create a OSC connection to Kairos
         */
        this.init = () => {
            if (this.oscHost === undefined || this.oscTXPort === undefined) {
                this.instance.log('warn', `Unable to connect, please configure a host and port in the instance configuration`);
                return;
            }
        };
        this.processData = (data) => {
            var _a, _b;
            // console.log('received',data)
            let recvMsg = data.address.toString().split('/');
            let zoomPart1 = recvMsg[1]; // zoom, zoomosc
            let zoomPart2 = recvMsg[2]; // user, me, pong, galleryShape etc.
            let zoomPart3 = recvMsg[3];
            let zoomId;
            // Do a switch block to go fast through the rest of the data
            if (zoomPart1 == 'zoomosc') {
                switch (zoomPart2) {
                    case 'me':
                    // let isMe = true
                    /* falls through */
                    case 'user':
                        switch (zoomPart3) {
                            case 'list':
                                // {int targetIndex}, {str userName}, {int galleryIndex}, {int zoomID}
                                // {int targetCount}
                                // {int listCount}
                                // {int userRole}
                                // {int onlineStatus}
                                // {in videoStatus}
                                // {int audioStatus}
                                // {int handRaised}
                                // Check if user exists
                                zoomId = parseInt(data.args[3].value);
                                if (this.instance.ZoomUserData[zoomId]) {
                                    this.instance.ZoomUserData[zoomId].username = data.args[1].value;
                                    this.instance.ZoomUserData[zoomId].galleryIndex = data.args[2].value;
                                    this.instance.ZoomUserData[zoomId].videoOn = data.args[8].value;
                                    this.instance.ZoomUserData[zoomId].mute = data.args[9].value;
                                    this.instance.ZoomUserData[zoomId].handRaised = data.args[10].value;
                                }
                                else {
                                    this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        videoOn: data.args[8].value,
                                        mute: data.args[9].value,
                                        handRaised: data.args[10].value,
                                    };
                                }
                                // Update all actions and presets
                                console.log('updating actions');
                                this.instance.updateInstance();
                                break;
                            case 'activeSpeaker':
                                console.log('receiving', data);
                                this.instance.ZoomClientDataObj.activeSpeaker = data.args[3].value;
                                // UPDATE FEEDBACK
                                break;
                            case 'videoOn':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].videoOn = true)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        videoOn: true,
                                    });
                                this.instance.checkFeedbacks('camera');
                                break;
                            case 'videoOff':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].videoOn = false)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        videoOn: false,
                                    });
                                this.instance.checkFeedbacks('camera');
                                break;
                            case 'mute':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].mute = true)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        mute: true,
                                    });
                                this.instance.checkFeedbacks('microphoneMute');
                                break;
                            case 'unMute':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].mute = false)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        mute: false,
                                    });
                                this.instance.checkFeedbacks('microphoneMute');
                                break;
                            case 'handRaised':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].handRaised = true)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        handRaised: true,
                                    });
                                break;
                            case 'handLowered':
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].handRaised = false)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                        handRaised: false,
                                    });
                                break;
                            case 'online':
                                // New user coming online, Call list?
                                console.log('receiving', data);
                                zoomId = parseInt(data.args[3].value);
                                this.instance.ZoomUserData[zoomId]
                                    ? (this.instance.ZoomUserData[zoomId].username = data.args[1].value)
                                    : (this.instance.ZoomUserData[zoomId] = {
                                        zoomId,
                                        username: data.args[1].value,
                                        galleryIndex: data.args[2].value,
                                    });
                                this.sendCommand('/zoom/list');
                                break;
                            default:
                                console.log('No Case provided for: ' + data.address);
                                console.log('Arguments', data.args);
                        }
                        break;
                    case 'galleryShape':
                        // {int rows} {int cols}
                        console.log('/zoomosc/galleryShape', data.args);
                        this.instance.ZoomClientDataObj.galleryShape[0] = data.args[0].value;
                        this.instance.ZoomClientDataObj.galleryShape[1] = data.args[1].value;
                        break;
                    case 'galleryOrder':
                        // {int item0} ... {int itemN}
                        console.log('/zoomosc/galleryOrder', data.args);
                        break;
                    case 'pong':
                        // {any pingArg (zero if none sent)}
                        // {str zoomOSCversion}
                        // {int subscribeMode}
                        // {int galTrackMode}
                        // {int callStatus 0 or 1}
                        // {int number of targets}
                        // {int number of users in call}
                        // {int isPro (1=true, 0-false)}
                        this.instance.ZoomClientDataObj.last_ping = Date.now();
                        this.instance.ZoomClientDataObj.zoomOSCVersion = data.args[1].value;
                        this.instance.ZoomClientDataObj.subscribeMode = data.args[2].value;
                        this.instance.ZoomClientDataObj.galTrackMode = data.args[3].value;
                        this.instance.ZoomClientDataObj.callStatus = data.args[4].value;
                        this.instance.ZoomClientDataObj.numberOfTargets = data.args[5].value;
                        this.instance.ZoomClientDataObj.numberOfUsersInCall = data.args[6].value;
                        (_a = this.instance.variables) === null || _a === void 0 ? void 0 : _a.updateVariables();
                        break;
                    case 'meetingStatus':
                        this.instance.ZoomClientDataObj.callStatus = data.args[0].value;
                        (_b = this.instance.variables) === null || _b === void 0 ? void 0 : _b.updateVariables();
                        break;
                    default:
                        console.log('No Case provided for: ' + data.address);
                        console.log('Arguments', data.args);
                }
            }
        };
        /**
         * @param command function and any params
         * @description Check OSC connection status and format command to send to Kairos
         */
        this.sendCommand = (path, args) => {
            // this.instance.oscSend(this.oscHost, this.oscTXPort, path, args ? args : [])
            console.log('sending', path, args ? args : '');
            this.udpPort.send({
                address: path,
                args: args ? args : [],
            }, this.oscHost, this.oscTXPort);
        };
        /**
         * @description Check for config changes and start new connections/polling if needed
         */
        this.update = () => {
            const hostCheck = this.instance.config.host !== this.oscHost || this.instance.config.tx_port !== this.oscTXPort;
            if (this.instance.ZoomClientDataObj.subscribeMode !== this.instance.config.subscribeMode) {
                console.log('update config');
                this.instance.ZoomClientDataObj.subscribeMode = this.instance.config.subscribeMode;
                this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.ZoomClientDataObj.subscribeMode });
            }
            if (hostCheck) {
                this.oscHost = this.instance.config.host;
                this.oscRXPort = this.instance.config.rx_port;
                this.oscTXPort = this.instance.config.tx_port;
                this.instance.config = this.instance.config;
                if (this.keepAliveInterval != undefined)
                    clearInterval(this.keepAliveInterval);
                let ready = true;
                if (ready)
                    this.init();
            }
        };
        this.instance = instance;
        this.oscHost = instance.config.host;
        this.oscTXPort = instance.config.tx_port;
        this.oscRXPort = instance.config.rx_port;
        this.udpPort = new osc.UDPPort({
            localAddress: '0.0.0.0',
            localPort: this.oscRXPort,
            metadata: true,
        });
        this.instance.ZoomClientDataObj = {
            last_ping: 0,
            subscribeMode: 0,
            galleryShape: [0, 0],
            oldgalleryShape: [0, 0],
            activeSpeaker: 'None',
            zoomOSCVersion: 'Not Connected',
            galTrackMode: 0,
            callStatus: 0,
            numberOfTargets: 0,
            numberOfUsersInCall: 0,
            listIndexOffset: 0,
            numberOfSelectedUsers: 0,
        };
        this.instance.ZoomUserData = [];
        // Listen for incoming OSC messages.
        this.udpPort.on('message', (oscMsg) => {
            this.processData(oscMsg);
            this.instance.status(this.instance.STATUS_OK);
        });
        this.udpPort.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log('error', 'Error: Selected port in use.' + err.message);
            }
        });
        // Open the socket.
        this.udpPort.open();
        // When the port is read
        this.udpPort.on('ready', () => {
            console.log('OSC listener active');
            // this.variables = new Variables(this)
            this.instance.log('debug', `Listening to ZoomOSC on port: ${this.oscRXPort}`);
            // Subscribe to ZoomOSC
            this.sendCommand('/zoom/subscribe', { type: 'i', value: this.instance.config.subscribeMode });
            this.sendCommand('/zoom/ping');
            this.sendCommand('/zoom/list');
        });
        this.init();
    }
}
exports.OSC = OSC;
