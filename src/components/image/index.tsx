import React, { MouseEventHandler } from "react";
import useWindowSize from "../../core/resize";
import "./image.scss";

export type ImageProps = {
    desktop: string,
    mobile?: string,
    alt?: string,
    classNames?: string,
    onClick?: MouseEventHandler<HTMLElement>,
    onMouseDown?: MouseEventHandler<HTMLElement>,
    onMouseUp?: MouseEventHandler<HTMLElement>,
    onMouseMove?: MouseEventHandler<HTMLElement>,
    onMouseEnter?: MouseEventHandler<HTMLElement>,
    onMouseLeave?: MouseEventHandler<HTMLElement>
}

/**
 * Returns an img tag with responsive src option
 */
const Image = (props: ImageProps) => {
    const size = useWindowSize();

    return (
        <img
            src={size.isMobile && props.mobile ? props.mobile : props.desktop}
            {...(props.classNames ? { "className": props.classNames } : {})}
            {...(props.alt ? { "alt": props.alt } : { "aria-hidden": "true" })}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseMove={props.onMouseMove}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave} />
    );
};

export default Image;