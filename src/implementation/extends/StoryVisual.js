import { fitIn } from '../helpers/video-composite';

export default (extendFrom) => {
    return class StoryVisualImpl extends extendFrom {
        constructor (options) {
            super(options);
            this.updateEmetadata('storyboard', []);
            this.updateEmetadata('storyTargetSource', null);
            this.updateEmetadata('storyCanvas', document.createElement('canvas'));
            this.storyCanvas.width = this.storyWidth * 1.1;
            this.storyCanvas.height = this.storyHeight * 1.1;
        }

        get storyboard() {
            return this.emetadata.storyboard;
        }

        get storyWidth() {
            return 106.67;
        }

        get storyHeight() {
            return 60;
        }

        get storyTargetSource() {
            return this.emetadata.storyTargetSource;
        }

        get storyCanvas() {
            return this.emetadata.storyCanvas;
        }
        
        get storyCtx() {
            return this.emetadata.storyCanvas.getContext('2d');
        }

        pushStory(data) {
            this.storyboard.push(data);
        }

        clearStoryboard() {
            this.updateEmetadata('storyboard', []);
        }

        renderStory(el, { callback, quality = 0.8 }) {
            const { width, height } = fitIn(this.storyCanvas, el);
            this.storyCtx.clearRect(0, 0, this.storyCanvas.width, this.storyCanvas.height);
            this.storyCtx.drawImage(el, 0, 0, width, height);
            const src = this.storyCanvas.toDataURL('image/webp', quality);
            callback(src);
        }
    };
};