export { default as useLoading } from "./loading";
export { default as useLockScroll } from "./lockscroll";
export { default as useWindowSize } from "./resize";

import { create } from 'zustand';
import "./global.scss";

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
        width: 0,
        height: 0,
        isMobile: false
    },
    increaseLoading: () => set((state) => { return { ...state, loading: state.loading + 1 } }),
    decreaseLoading: () => set((state) => { return { ...state, loading: state.loading - 1 } }),
    setScroll: (scroll: { lastScrollPosition: number, lockedScrollCount: number }) => set({ scroll }),
    setSize: (size: { width?: number, height?: number, isMobile: boolean }) => set({ size })
}));

if (typeof (window) != "undefined") {
    let timeout: NodeJS.Timeout;

    window.addEventListener("resize", function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            useVanoraStore.getState().setSize({
                width: document.documentElement.clientWidth,
                height: window.innerHeight,
                isMobile: document.documentElement.clientWidth <= 900
            });
        }, 250);
    });
}