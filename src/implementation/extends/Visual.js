import {
    ACCEPT_MODE_FILL,
    ACCEPT_MODE_FIT,
    scaleTo,
} from '../helpers/video-composite';
import getBase from './Base';

export default (extendFrom) => {
    return class VisualImpl extends getBase(extendFrom) {
        constructor (options) {
            super(options);
            this.setEditable(false);
            this.setFitMode(ACCEPT_MODE_FIT);
            this.setFitOverride(null);
            this.setSourceLoaded(false);
            this.setupSourceLoaded();
        }

        get sourceLoaded() {
            return this.emetadata.sourceLoaded;
        }

        get fullLoadedSource() {
            return this.sourceLoaded;
        }

        get editable() {
            return this.emetadata.editable;
        }

        get fitOverride() {
            return this.emetadata.fitOverride;
        }

        get fitMode() {
            return this.emetadata.fitMode;
        }

        get hasCanFitToCanvas() {
            return !this.fitOverride && this.movie;
        }

        get sourceRealSize() {
            return {
                width: this.source.width,
                height: this.source.height,
            };
        }

        setSourceLoaded(value) {
            this.updateEmetadata('sourceLoaded', value);
        }

        setupSourceLoaded() {
            this.source.onload = () => {
                this.setSourceLoaded(true);
                this.fitToCanvas();
            };
        }

        setFitMode(mode = ACCEPT_MODE_FIT) {
            this.updateEmetadata('fitMode', mode);
        }

        setEditable(value) {
            this.updateEmetadata('editable', value);
        }

        setFitOverride(data = null) {
            this.updateEmetadata('fitOverride', data);
        }

        setEditableValues({ x, y, width, height }) {
            this.setFitOverride({ x, y, width, height });
            this.fitToCanvas();
        }

        toEditableValues() {
            return {
                x: this.destX,
                y: this.destY,
                width: this.destWidth,
                height: this.destHeight,
            };
        }

        getFitScaleValue(baseValue, dir) {
            return baseValue * this.movie.recordFitMulty[dir];
        }

        getFitUnScaleValue(baseValue, dir) {
            return baseValue / this.movie.recordFitMulty[dir];
        }

        fitToCanvas() {
            if (!this.hasCanFitToCanvas) {
                this.fitOverideToCanvas();
                return;
            }
            const { width: cWidth, height: cHeight } = this.movie.canvas;
            const { width: sWidth, height: sHeight } = this.sourceRealSize;
            const fitData = scaleTo(
                { w: sWidth, h: sHeight },
                {
                    w: this.getFitUnScaleValue(cWidth, 'x'),
                    h: this.getFitUnScaleValue(cHeight, 'y')
                },
                this.fitMode === ACCEPT_MODE_FILL
            );
            this.destWidth = this.getFitScaleValue(fitData.destWidth, 'x');
            this.destHeight = this.getFitScaleValue(fitData.destHeight, 'y');
            this.destX = this.getFitScaleValue(fitData.destX, 'x');
            this.destY = this.getFitScaleValue(fitData.destY, 'y');
            this.width = this.getFitScaleValue(fitData.width, 'x');
            this.height = this.getFitScaleValue(fitData.height, 'y');
            this.x = this.getFitScaleValue(fitData.x, 'x');
            this.y = this.getFitScaleValue(fitData.y, 'y');
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