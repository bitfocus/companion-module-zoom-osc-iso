"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variables = void 0;
class Variables {
    constructor(instance) {
        /**
         * @param name Instance variable name
         * @returns Value of instance variable or undefined
         * @description Retrieves instance variable from any Zoom instances
         */
        this.get = (variable) => {
            let data;
            this.instance.parseVariables(variable, (value) => {
                data = value;
            });
            return data;
        };
        /**
         * @param variables Object of variablenames and their values
         * @description Updates or removes variable for current instance
         */
        this.set = (variables) => {
            var _a;
            const newVariables = {};
            for (const name in variables) {
                newVariables[name] = (_a = variables[name]) === null || _a === void 0 ? void 0 : _a.toString();
            }
            this.instance.setVariables(newVariables);
        };
        /**
         * @description Sets variable definitions
         */
        this.updateDefinitions = () => {
            const globalSettings = new Set([
                // Status
                { label: 'zoomOSC version', name: 'zoomOSCversion' },
                { label: 'callStatus', name: 'callStatus' }
            ]);
            let filteredVariables = [
                ...globalSettings,
            ];
            this.instance.setVariableDefinitions(filteredVariables);
        };
        /**
         * @description Update variables
         */
        this.updateVariables = () => {
            const newVariables = {};
            newVariables['zoomOSCversion'] = this.instance.ZoomClientDataObj.zoomOSCVersion;
            newVariables['callStatus'] = this.instance.ZoomClientDataObj.callStatus;
            this.set(newVariables);
            this.updateDefinitions();
        };
        this.instance = instance;
    }
}
exports.Variables = Variables;
