import React from 'react';
import defaultClasses from './video.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

/**
 * Page Builder Video component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Video
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Video using an iframe.
 */
const Video = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        url,
        maxWidth,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const mainStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };
    const innerStyles = {
        maxWidth
    };
    const wrapperStyles = {
        // The below is required for a quirk in some browsers that won't display borders on videos
        backgroundColor: borderColor,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const Video =
        url && url.length ? (
            <div className={classes.container}>
                <iframe
                    className={classes.video}
                    title={url}
                    frameBorder="0"
                    allowFullScreen="1"
                    loading="lazy"
                    src={url}
                />
            </div>
        ) : '';

    return (
        <div
            style={mainStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <div style={innerStyles} className={classes.inner}>
                <div style={wrapperStyles}>{Video}</div>
            </div>
        </div>
    );
};

/**
 * Props for {@link Video}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Video
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} classes.inner CSS classes for the inner container element
 * @property {String} classes.container CSS classes for the container element
 * @property {String} classes.video CSS classes for the video element
 * @property {String} url Embed URL to render the video from an external provider (YouTube, Vimeo etc)
 * @property {String} maxWidth Maximum width of the video
 * @property {String} textAlign Alignment of the video within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Video.propTypes = {
    classes: shape({
        root: string,
        inner: string,
        container: string,
        video: string
    }),
    url: string,
    maxWidth: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default Video;
