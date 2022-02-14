import getMediaSource from './MediaSource';

export default (Audio) => {
    return class AudioImpl extends getMediaSource(Audio) {
        constructor (options) {
            super(options);
        }
    };
};