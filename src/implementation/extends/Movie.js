import {
    ACCEPT_RAITO_16_9,
    getAcceptRaitoByType,
    Vector2,
} from '../helpers/video-composite';

const DEFAULT_FIT_MULTIPLY = 10;

export default (Movie) => {
    return class MovieImpl extends Movie {
        constructor (options) {
            super(options);
            this._fitMultipy = DEFAULT_FIT_MULTIPLY;
            this._acceptRaito = ACCEPT_RAITO_16_9;
            this.attemptRecording = false;
        }

        get acceptRaito() {
            return this._acceptRaito;
        }

        get acceptRaitoData() {
            return getAcceptRaitoByType(this.acceptRaito);
        }

        set acceptRaito(value) {
            this._acceptRaito = value;
            this.updateMovieSize(this.acceptRaitoData.size);
            this.fitToCanvasAll();
        }

        get fitMulty() {
            const { recordSize, size } = this.acceptRaitoData;
            const w = recordSize.x / size.x;
            const h = recordSize.y / size.y;
            return Vector2(w, h);
        }

        get recordFitMulty() {
            return this.attemptRecording ? this.fitMulty : Vector2(1, 1);
        }

        updateMovieSize({ x, y }) {
            this.width = x;
            this.height = y;
        }

        fitToCanvasAll() {
            this.layers.forEach(l => l.fitToCanvas());
        }

        recordHigh(recordOptions) {
            const layersSetRecording = () => this.movie.layers
                .forEach(l => {
                    l.setEditable(false);
                    l.fitToCanvas();
                });
            const resetToDefault = () => {
                this.attemptRecording = false;
                this.updateMovieSize(this.acceptRaitoData.size);
                layersSetRecording();
                this.canvas.style.opacity = '';
            };
            this.attemptRecording = true;
            this.updateMovieSize(this.acceptRaitoData.recordSize);
            layersSetRecording();
            this.canvas.style.opacity = 0;
            
            return this.record(recordOptions)
                .then((data) => {
                    resetToDefault();
                    console.log('data', data);
                    return data;
                })
                .catch(err => {
                    resetToDefault();
                    console.error('vd.movie.recordHight', err);
                    return err;
                });
        }
    };
};