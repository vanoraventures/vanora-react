import React from "react";
import ReactDOM from 'react-dom';

export type PortalProps = {
    children: JSX.Element | JSX.Element[],
    targetSelector?: string
}

/**
 * Easy usage for React Portals
 */
const Portal = (props: PortalProps) => <>
    {typeof (window) != "undefined" &&
        <>{ReactDOM.createPortal(props.children, document.querySelector(props.targetSelector ?? "body") as HTMLElement)}</>
    }
</>

export default Portal;