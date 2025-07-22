import React, { useEffect, useState } from "react";
import useLockScroll from "../../core/lockscroll";
import "./popup.scss";

export type PopupProps = {
    popup?: Popup,
    isOpen?: boolean,
    classNames?: string,
    children: JSX.Element | JSX.Element[] | string,
    onOpen?: () => void,
    onClose?: () => void
}

type Popup = {
    open: () => void,
    close: (preventOnClose?: boolean) => void
}

/**
 * Returns a popup with customized options
 */
const Popup = (props: PopupProps) => {
    const [lockScroll, unlockScroll] = useLockScroll();
    const [state, setState] = useState<"opened" | "closed">("closed");

    const open = () => {
        lockScroll();
        setState("opened");

        if (props.onOpen) {
            props.onOpen();
        }
    }

    const close = (preventOnClose?: boolean) => {
        unlockScroll();
        setState("closed");

        if (!preventOnClose && props.onClose) {
            props.onClose();
        }
    }

    if (props.popup) {
        props.popup.open = open;
        props.popup.close = close;
    }

    useEffect(() => {
        if (props.isOpen) {
            open();
        }

        return () => {
            close(true);
        }
    }, []);

    const closeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if ((e.target as HTMLElement).classList.contains("popup-wrapper")) {
            close();
        }
    }

    return (
        <div className={"popup-wrapper " + state + (props.classNames ? " " + props.classNames : "")} onClick={closeClick}>
            {props.children}
        </div>
    );
};

/**
 * Returns an object to give as props to popup component for more control on popup
 */
export function usePopup(): Popup {
    return {
        open: () => { },
        close: () => { }
    };
}

export default Popup;