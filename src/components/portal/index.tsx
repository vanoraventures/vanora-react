import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

export type PortalProps = {
    children: JSX.Element | JSX.Element[],
    targetSelector?: string
}

/**
 * Easy usage for React Portals
 */
const Portal = (props: PortalProps) => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return <>{hydrated ? ReactDOM.createPortal(props.children, document.querySelector(props.targetSelector ?? "body") as HTMLElement) : <></>}</>;
}

export default Portal;