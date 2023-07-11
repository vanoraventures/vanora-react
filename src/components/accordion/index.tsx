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
const Accordion = (props: Props & { closeOthersOnOpen?: boolean }) => {
    const [items, setItems] = useState<React.Dispatch<React.SetStateAction<boolean>>[]>([]);

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

export default Accordion;