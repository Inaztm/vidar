import { publish } from '../../event.ts';
import getVisual from './Visual';

export default (extendFrom) => {
    return class MediaSourceImpl extends getVisual(extendFrom) {
        constructor (options) {
            super(options);
            this.updateEmetadata('duplicatedSource', null);
            this.setDuplicatedSource(this.source);
        }

        get duplicatedSource() {
            return this.emetadata.duplicatedSource;
        }

        get hasSourceBuffering() {
            return this.source.readyState < 2;
        }

        get fullLoadedSource() {
            return this.sourceLoaded && !this.hasSourceBuffering;
        }

        setDuplicatedSource(source) {
            const el = source.cloneNode();
            this.updateEmetadata('duplicatedSource', el);
            this.duplicatedSource.preload = 'metadata';
            this.duplicatedSource.crossOrigin = 'anonymous';
            this.duplicatedSource.onloadedmetadata = () => {
                publish(
                    this.movie,
                    'movie.change.layer.onLoadedDuplicatedSource',
                    { layer: this }
                );
            };
        }

        setupSourceLoaded() {
            this.source.onloadeddata = () => {
                this.setSourceLoaded(true);
                this.fitToCanvas();
            };
        }
    };
};