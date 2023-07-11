import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import "./tabs.scss";

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

type TabsProps = Props & {
    startIndex?: number,
    onChange?: (index: number) => void
}

type TabContextType = {
    index: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>
}

const TabContext = React.createContext<TabContextType | null>(null) as React.Context<TabContextType>;

/**
 * Must have two child components TabMenu and TabContainer
 */
const Tabs = (props: TabsProps) => {
    const [index, setIndex] = useState(props.startIndex ? props.startIndex : 0);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(index);
        }
    }, [index]);

    return (
        <TabContext.Provider value={{ index, setIndex }}>
            <div
                className={"tabs" + (props.classNames ? " " + props.classNames : "")}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}>
                {props.children}
            </div>
        </TabContext.Provider>
    );
};

/**
 * Must have TabMenuItem components
 */
export const TabMenu = (props: Props & { children: JSX.Element[] }) => {
    return (
        <div
            className={"tab-menu" + (props.classNames ? " " + props.classNames : "")}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseMove={props.onMouseMove}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
            {props.children.map((item, index) => {
                return <TabMenuItem key={"tab-menu-item-" + index} {...item.props} index={index}></TabMenuItem>
            })}
        </div>
    );
};

/**
 * TabMenuItem can have any children
 */
export const TabMenuItem = (props: Props & { index?: number }) => {
    const context = useContext(TabContext);

    const click = (event: any) => {
        context.setIndex(props.index??0);

        if (props.onClick) {
            props.onClick(event);
        }
    }

    return (
        <div
            className={"tab-menu-item" + (props.classNames ? " " + props.classNames : "") + (context.index === props.index ? " active" : "")}
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
 * Must have TabItem components
 */
export const TabContainer = (props: Props & { children: JSX.Element[] }) => {
    const context = useContext(TabContext);

    return (
        <div
            className={"tab-container" + (props.classNames ? " " + props.classNames : "")}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseMove={props.onMouseMove}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
            {props.children.map((item, index) => {
                if (index === context.index && item.type === TabItem) {
                    return item;
                }
            })}
        </div>
    );
};

/**
 * TabItem can have any children
 */
export const TabItem = (props: Props) => {
    return (
        <div
            className={"tab-item" + (props.classNames ? " " + props.classNames : "")}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseMove={props.onMouseMove}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
            {props.children}
        </div>
    );
};

export default Tabs;