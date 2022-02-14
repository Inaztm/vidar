export function uuidv4() {
    const hex = "0123456789ABCDEF";
    const model = "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx";
    var str = "";
    for (var i = 0; i < model.length; i++) {
      var rnd = Math.floor(Math.random() * hex.length);
      str += model[i] == "x" ?  hex[rnd] : model[i] ;
    }
    return str.toLowerCase();
}

export const getText = (data) => data ? data.text || data : '';

export const tryFindLayers = (acc, item) => {
    if (item && item.layers && item.layers.length) {
        const validLayers = item.layers.filter(l => l.nm);
        item.layers.forEach(e => tryFindLayers(acc, e));
        acc.push(validLayers);
    }
    return acc;
};

export const chekRenderType = (data, type) => {
    const check = (item) => Boolean(item && item.type === type && item.template);
    if (data && data.titleTemplateExportTemplate) {
        return check(data.titleTemplateExportTemplate);
    }
    if (data && data.exportTemplate) {
        return check(data.exportTemplate);
    }
    return false;
};

export const getSourceLayers = (source) => {
    return (source.assets || [])
        .concat([{ layers: source.layers || [] }])
        .reduce(tryFindLayers, [])
        .flat();
};

export const trySetAnimationText = (layer, data) => {
    const layerKey = 'nm';
    if (!layer || !layer.elements || !layer.elements.length) {
        return;
    }
    layer.elements
        .filter(el => el)
        .forEach(el => {
            const key = el.data && el.data[layerKey];
            const value = data && data[key];
            if (value) {
                const text = getText(value);
                el.canResizeFont(true);
                el.updateDocumentData({ t: text }, 0);
            }
            trySetAnimationText(el, data);
        });
};

export const createAnimationWrapper = (type = 'div') => {
    const wrapper = document.createElement(type);
    wrapper.id = `vd-title-wrapper-${uuidv4()}`;
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    document.body.appendChild(wrapper);
    return wrapper;
};

export const createAnimation = (bodymovin, options, wrapper = createAnimationWrapper()) => {
    if (!bodymovin) {
        return null;
    }
    return bodymovin.loadAnimation(Object.assign({}, {
        container: wrapper,
        renderer: 'svg',
        loop: false,
        autoplay: false,
    }, options));
};

export const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

const addNameSpace = (data) => {
    if (data.indexOf('http://www.w3.org/2000/svg') < 0) {
        data = data.replace(/<svg/g, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    return data;
};
  
export const encodeSVG = (data, externalQuotesValue = 'double') => {
    let result = data;
    // Use single quotes instead of double to avoid encoding.
    if (externalQuotesValue === 'double') {
        result = result.replace(/"/g, '\'');
    } else {
        result = result.replace(/'/g, '"');
    }
  
    result = result.replace(/>\s{1,}</g, '><');
    result = result.replace(/\s{2,}/g, ' ');
  
    // Using encodeURIComponent() as replacement function
    // allows to keep result code readable
    return result.replace(symbols, encodeURIComponent);
};

export const renderAnimationFrame = (animation, el, time) => {
    animation.goToAndStop(time * animation.frameRate, true);
    const imageEncoded = encodeSVG(addNameSpace(animation.renderer.svgElement.outerHTML));
    el.src = `data:image/svg+xml,${imageEncoded}`;
};
