import {
    createMediaEl
} from '../helpers/video-composite';
import getStoryVisual from './StoryVisual';
import getVisual from './Visual';

export default (Image) => {
    return class ImageImpl extends getStoryVisual(getVisual(Image)) {
        constructor (options) {
            super(options);
            this.updateEmetadata('storyTargetSource', createMediaEl('', 'img'));
        }
    };
};