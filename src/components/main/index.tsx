import React, { useEffect } from "react";
import create from "zustand";
import "./global.scss";

type MainProps = {
    children: JSX.Element | JSX.Element[],
    loadingWrapper?: JSX.Element
}

type VanoraStore = {
    loading: number,
    scroll: {
        lastScrollPosition: number,
        lockedScrollCount: number
    },
    size: {
        width?: number,
        height?: number,
        isMobile: boolean
    },
    increaseLoading: () => void,
    decreaseLoading: () => void,
    setScroll: (scroll: { lastScrollPosition: number, lockedScrollCount: number }) => void,
    setSize: (loading: { width?: number, height?: number, isMobile: boolean }) => void
}

export const useVanoraStore = create<VanoraStore>(set => ({
    loading: 0,
    scroll: {
        lastScrollPosition: 0,
        lockedScrollCount: 0
    },
    size: {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
        isMobile: document.documentElement.clientWidth <= 900
    },
    increaseLoading: () => set((state) => { return { ...state, loading: state.loading + 1 } }),
    decreaseLoading: () => set((state) => { return { ...state, loading: state.loading - 1 } }),
    setScroll: (scroll: { lastScrollPosition: number, lockedScrollCount: number }) => set({ scroll }),
    setSize: (size: { width?: number, height?: number, isMobile: boolean }) => set({ size })
}));

/**
 * Main wrapper for Vanora React Library
 */
const Vanora = (props: MainProps) => {
    const setSize = useVanoraStore(state => state.setSize);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        function handleResize() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setSize({
                    width: document.documentElement.clientWidth,
                    height: window.innerHeight,
                    isMobile: document.documentElement.clientWidth <= 900
                });
            }, 250);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return <>
        {props.children}
        <Loading wrapper={props.loadingWrapper} />
    </>;
};

const Loading = (props: { wrapper?: JSX.Element }) => {
    const count = useVanoraStore(state => state.loading);

    if (count > 0) {
        if (props.wrapper) {
            return props.wrapper
        }

        return <div className="loading">
            <svg className="load" x="0px" y="0px" viewBox="0 0 150 150">
                <circle className="loading-inner" cx="75" cy="75" r="60"></circle>
            </svg>
        </div>
    }

    return <></>;
}

export default Vanora;