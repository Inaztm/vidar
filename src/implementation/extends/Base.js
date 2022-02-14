import { uuidv4 } from '../helpers/lottieHelpers';
import {
    TYPE_AUDIO, TYPE_MEDIA, TYPE_TITLE, _end, _full, _start,
} from '../helpers/video-composite';

export default (extendFrom) => {
    return class BaseImpl extends extendFrom {
        constructor (options) {
            super(options);
            this._emetadata = {};
            this.setAssetData(null);
            this.setAssetType(null);
            this.setUuid(uuidv4());
            this.clearGroup();
        }

        get emetadata() {
            return this._emetadata;
        }

        get assetData() {
            return this.emetadata.assetData;
        }

        get assetType() {
            return this.emetadata.assetType;
        }

        get uuid() {
            return this.emetadata.uuid;
        }

        get isCg() {
            return this.assetType === TYPE_TITLE;
        }

        get isMedia() {
            return this.assetType === TYPE_MEDIA;
        }

        get isAudio() {
            return this.assetType === TYPE_AUDIO;
        }

        get group() {
            return this.emetadata.group;
        }

        setEmetadata(data) {
            this._emetadata = data;
        }

        updateEmetadata(key, value) {
            this._emetadata[key] = value;
        }

        setAssetData(data) {
            this.updateEmetadata('assetData', data);
        }

        setAssetType(value) {
            this.updateEmetadata('assetType', value);
        }

        setUuid(value) {
            this.updateEmetadata('uuid', value);
        }

        attachGroup(group) {
            this.updateEmetadata('group', group);
        }

        clearGroup() {
            this.updateEmetadata('group', null);
        }

        toCalculateData() {
            return {
                start: _start(this),
                full: _full(this),
                end: _end(this),
            };
        }

        static extractOptions(options, optionsToExtract = []) {
            const extractedOptions = {};
            Object.keys(options).forEach((key) => {
                if (optionsToExtract.includes(key)) {
                    extractedOptions[key] = options[key];
                    delete options[key];
                }
            });
            return extractedOptions;
        }
    };
};