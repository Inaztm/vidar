import getMediaSource from './MediaSource';
import getStoryVisual from './StoryVisual';

export default (Video) => {
    return class VideoImpl extends getStoryVisual(getMediaSource(Video)) {
        constructor (options) {
            super(options);
            this.updateEmetadata('storyTargetSource', this.duplicatedSource);
        }

        get sourceRealSize() {
            return {
                width: this.source.videoWidth,
                height: this.source.videoHeight,
            };
        }
    };
};