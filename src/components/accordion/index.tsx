import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import "./accordion.scss";

type Props = {
    classNames?: string,
    children: JSX.Element | JSX.Element[] | string,
    onClick?: MouseEventHandler<HTMLElement>,
    onMouseDown?: MouseEventHandler<HTMLElement>,
    onMouseUp?: MouseEventHandler<HTMLElement>,
    onMouseMove?: MouseEventHandler<HTMLElement>,
    onMouseEnter?: MouseEventHandler<HTMLElement>,
    onMouseLeave?: MouseEventHandler<HTMLElement>
}

type ItemProps = Props & {
    isActive?: boolean,
    onOpen?: () => void,
    onClose?: () => void
}

type AccordionContextType = {
    closeOthersOnOpen: boolean,
    items: React.Dispatch<React.SetStateAction<boolean>>[],
    setItems: React.Dispatch<React.SetStateAction<React.Dispatch<React.SetStateAction<boolean>>[]>>
}

type ItemContextType = {
    isActive: boolean,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const AccordionContext = React.createContext<AccordionContextType | null>(null) as React.Context<AccordionContextType>;
export const AccordionItemContext = React.createContext<ItemContextType | null>(null) as React.Context<ItemContextType>;

/**
 * Must have AccordionItem component
 */
const Accordion = (props: Props & { accordion?: AccordionType, closeOthersOnOpen?: boolean }) => {
    const [items, setItems] = useState<React.Dispatch<React.SetStateAction<boolean>>[]>([]);

    if (props.accordion) {
        props.accordion.open = (index?: number) => {
            if (typeof (index) != "undefined") {
                if (items[index]) {
                    items[index](true);
                }
            }
            else {
                items.forEach((item) => {
                    item(true);
                });
            }
        }
        props.accordion.close = (index?: number) => {
            if (typeof (index) != "undefined") {
                if (items[index]) {
                    items[index](false);
                }
            }
            else {
                items.forEach((item) => {
                    item(false);
                });
            }
        }
    }

    return (
        <AccordionContext.Provider value={{ closeOthersOnOpen: props.closeOthersOnOpen ?? false, items, setItems }}>
            <div
                className={"accordion" + (props.classNames ? " " + props.classNames : "")}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}>
                {props.children}
            </div>
        </AccordionContext.Provider>
    );
};

/**
 * Must have two components AccordionHeader and AccordionBody
 */
export const AccordionItem = (props: ItemProps) => {
    const context = useContext(AccordionContext);
    const [isActive, setIsActive] = useState(props.isActive ? props.isActive : false);

    useEffect(() => {
        context.setItems(x => [...x, setIsActive]);
    }, []);

    useEffect(() => {
        if (isActive) {
            if (context.closeOthersOnOpen) {
                context.items.forEach((item) => {
                    if (item != setIsActive) {
                        item(false);
                    }
                });
            }

            if (props.onOpen) {
                props.onOpen();
            }
        }
        else {
            if (props.onClose) {
                props.onClose();
            }
        }
    }, [isActive]);

    return (
        <AccordionItemContext.Provider value={{ isActive, setIsActive }}>
            <div
                className={"accordion-item" + (props.classNames ? " " + props.classNames : "") + (isActive ? " active" : "")}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}>
                {props.children}
            </div>
        </AccordionItemContext.Provider>
    );
};

/**
 * AccordionHeader can have any children
 */
export const AccordionHeader = (props: Props) => {
    const context = useContext(AccordionItemContext);

    const click = (event: any) => {
        context.setIsActive(!context.isActive);

        if (props.onClick) {
            props.onClick(event);
        }
    }

    return (
        <div
            className={"accordion-header" + (props.classNames ? " " + props.classNames : "")}
            onClick={click}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseMove={props.onMouseMove}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
            {props.children}
        </div>
    );
};

/**
 * AccordionBody can have any children
 */
export const AccordionBody = (props: Props) =>
    <div
        className={"accordion-body" + (props.classNames ? " " + props.classNames : "")}
        onClick={props.onClick}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseMove={props.onMouseMove}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}>
        {props.children}
    </div>;

export type AccordionType = {
    /**
    * Opens the specified accordion item. If index is not given opens all items.
    */
    open: (index?: number) => void,
    /**
    * Closes the specified accordion item. If index is not given closes all items.
    */
    close: (index?: number) => void
}

/**
 * Returns an object to control Accordion.
 */
export function useAccordion(): AccordionType {
    return {
        open: () => { },
        close: () => { }
    };
}

export default Accordion;