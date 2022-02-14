import getHtmlTitle from '../extends/HtmlTitle';
import getImage from '../extends/Image';
import getVideo from '../extends/Video';
import getTitle from '../extends/Title';
import getBase from '../extends/Base';
import getMovie from '../extends/Movie';

export default (data) => Object.assign({},
    data,
    {
        layer: {
            ...data.layer,
            getIHtmlTitle: (bodymovin) => getHtmlTitle(data.layer.Image, bodymovin),
            IImage: getImage(data.layer.Image),
            IVideo: getVideo(data.layer.Video),
            ITitle: getTitle(data.layer.Image),
            IBase: getBase(data.layer.Visual),
        },
        IMovie: getMovie(data.Movie)
    }
);