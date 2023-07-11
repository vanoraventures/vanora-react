import React, { MouseEventHandler } from "react";
import useWindowSize from "../../core/resize";
import "./background.scss";

export type BackgroundProps = {
    desktop: string,
    mobile?: string,
    isSection?: boolean,
    classNames?: string,
    children?: JSX.Element | JSX.Element[] | string,
    onClick?: MouseEventHandler<HTMLElement>,
    onMouseDown?: MouseEventHandler<HTMLElement>,
    onMouseUp?: MouseEventHandler<HTMLElement>,
    onMouseMove?: MouseEventHandler<HTMLElement>,
    onMouseEnter?: MouseEventHandler<HTMLElement>,
    onMouseLeave?: MouseEventHandler<HTMLElement>
}

/**
 * Returns a given tag with responsive background-image option
 */
const Background = (props: BackgroundProps) => {
    const size = useWindowSize();

    return (
        <>
            {props.isSection ?
                <section
                    {...(props.classNames ? { "className": props.classNames } : {})}
                    style={{ backgroundImage: "url(" + (size.isMobile && props.mobile ? props.mobile : props.desktop) + ")" }}
                    onClick={props.onClick}
                    onMouseDown={props.onMouseDown}
                    onMouseUp={props.onMouseUp}
                    onMouseMove={props.onMouseMove}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}>
                    {props.children}
                </section>
                :
                <div
                    {...(props.classNames ? { "className": props.classNames } : {})}
                    style={{ backgroundImage: "url(" + (size.isMobile && props.mobile ? props.mobile : props.desktop) + ")" }}
                    onClick={props.onClick}
                    onMouseDown={props.onMouseDown}
                    onMouseUp={props.onMouseUp}
                    onMouseMove={props.onMouseMove}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}>
                    {props.children}
                </div>
            }
        </>
    );
};

export default Background;