import getImage from './Image';

export default (Image) => {
    return class TitleImpl extends getImage(Image) {
        constructor (options) {
            super(options);
        }
    };
};