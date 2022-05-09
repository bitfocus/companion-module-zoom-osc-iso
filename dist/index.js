"use strict";
const instance_skel = require("../../../instance_skel");
const actions_1 = require("./actions");
const config_1 = require("./config");
const feedback_1 = require("./feedback");
// import { getPresets } from './presets'
const variables_1 = require("./variables");
const osc_1 = require("./osc");
/**
 * Companion instance class for Zoom
 */
class ZoomInstance extends instance_skel {
    constructor(system, id, config) {
        super(system, id, config);
        this.connected = false;
        this.OSC = null;
        this.variables = null;
        /**
         * @returns config options
         * @description generates the config options available for this instance
         */
        this.config_fields = () => {
            return (0, config_1.getConfigFields)();
        };
        /**
         * @description close connections and stop timers/intervals
         */
        this.destroy = () => {
            this.log('debug', `Instance destroyed: ${this.id}`);
        };
        this.system = system;
        this.config = config;
    }
    /**
     * @description triggered on instance being enabled
     */
    init() {
        // New Module warning
        this.log('info', `Welcome, Zoom module is loading`);
        this.status(this.STATUS_WARNING, 'Connecting');
        this.variables = new variables_1.Variables(this);
        this.OSC = new osc_1.OSC(this);
        this.updateInstance();
        this.variables.updateDefinitions();
    }
    /**
     * @param config new configuration data
     * @description triggered every time the config for this instance is saved
     */
    updateConfig(config) {
        this.config = config;
        this.updateInstance();
        // this.setPresetDefinitions(getPresets(this) as CompanionPreset[])
        if (this.variables)
            this.variables.updateDefinitions();
    }
    /**
     * @description sets actions and feedbacks available for this instance
     */
    updateInstance() {
        // Cast actions and feedbacks from Zoom types to Companion types
        const actions = (0, actions_1.getActions)(this);
        const feedbacks = (0, feedback_1.getFeedbacks)(this);
        // const presets = getPresets(this) as CompanionPreset[]
        this.setActions(actions);
        this.setFeedbackDefinitions(feedbacks);
        // this.setPresetDefinitions(presets)
    }
}
module.exports = ZoomInstance;
