import fieldsToObject from '../helpers/fieldsToObject';
import {
    createAnimation, renderAnimationFrame, trySetAnimationText
} from '../helpers/lottieHelpers';
import { ACCEPT_MODE_FILL } from '../helpers/video-composite';
import getTitle from './Title';

export default (Image, bodymovin) => {
    return class HtmlTitleImpl extends getTitle(Image) {
        constructor (options) {
            const { animationData } = this.constructor.extractOptions(options, ['animationData']);
            super(options);
            this.updateEmetadata('animation', createAnimation(bodymovin, { animationData }));
            this.updateEmetadata('storyAnimation', createAnimation(bodymovin, { animationData }));

            const totalSeconds = this.animation.totalFrames / this.animation.frameRate;
            this.source.duration = totalSeconds;

            if (this.duration > this.source.duration) {
                this.duration = totalSeconds;
            }
            this.setupAnimationSourceLoaded();
        }

        get storyHeight() {
            return 55;
        }

        get animation() {
            return this.emetadata.animation;
        }

        get storyAnimation() {
            return this.emetadata.storyAnimation;
        }

        get animationTextData() {
            return fieldsToObject()(this.assetData ? this.assetData.fields : []);
        }

        renderAnimationFrame(animation, el, time) {
            renderAnimationFrame(animation, el, time);
        }

        updateAnimationTextBy(animation, data = this.animationTextData) {
            if (animation && data) {
                trySetAnimationText(animation.renderer, data);
            }
        }

        updateAnimationText() {
            this.updateAnimationTextBy(this.animation);
        }

        setupAnimationSourceLoaded() {
            this.animation.addEventListener('DOMLoaded', () => {
                this.setSourceLoaded(true);
                this.fitToCanvas();
            });
        }

        setupSourceLoaded() {
        }

        beginRender() {
            super.beginRender();
            this.updateAnimationText();
        }

        doRender() {
            super.doRender();
            this.renderAnimationFrame(this.animation, this.source, this.currentTime);
        }

        fitToCanvas() {
            if (this.fitMode !== ACCEPT_MODE_FILL) {
                super.fitToCanvas();
                return;
            }
            if (!this.hasCanFitToCanvas) {
                this.fitOverideToCanvas();
                return;
            }
            const { width: cWidth, height: cHeight } = this.movie.canvas;
            const { width: sWidth, height: sHeight } = this.sourceRealSize;
            this.destWidth = this.getFitScaleValue(cWidth, 'x');
            this.destHeight = this.getFitScaleValue(cHeight, 'y');
            this.destX = 0;
            this.destY = 0;
            this.width = this.getFitScaleValue(sWidth, 'x');
            this.height = this.getFitScaleValue(sHeight, 'y');
            this.x = 0;
            this.y = 0;
        }

        fitOverideToCanvas() {
            if (!this.fitOverride) {
                return;
            }
            const { width: sWidth, height: sHeight } = this.sourceRealSize;
            this.destWidth = this.getFitScaleValue(this.fitOverride.width, 'x');
            this.destHeight = this.getFitScaleValue(this.fitOverride.height, 'y');
            this.destX = this.getFitScaleValue(this.fitOverride.x, 'x');
            this.destY = this.getFitScaleValue(this.fitOverride.y, 'y');
            this.width = this.getFitScaleValue(sWidth, 'x');
            this.height = this.getFitScaleValue(sHeight, 'y');
            this.x = 0;
            this.y = 0;
        }
    };
};