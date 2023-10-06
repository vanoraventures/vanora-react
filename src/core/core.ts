import { create } from 'zustand';
import "./core.scss";

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
    setSize: (loading: { width?: number, height?: number, isMobile: boolean }) => void,
    getRecaptchaToken?: () => Promise<string>
}

const useVanoraStore = create<VanoraStore>(set => ({
    loading: 0,
    scroll: {
        lastScrollPosition: 0,
        lockedScrollCount: 0
    },
    size: {
        width: typeof (window) != "undefined" ? window.innerWidth : 0,
        height: typeof (window) != "undefined" ? window.innerHeight : 0,
        isMobile: typeof (window) != "undefined" ? window.innerWidth <= 900 : false
    },
    increaseLoading: () => set((state) => { return { ...state, loading: state.loading + 1 } }),
    decreaseLoading: () => set((state) => { return { ...state, loading: state.loading - 1 } }),
    setScroll: (scroll: { lastScrollPosition: number, lockedScrollCount: number }) => set({ scroll }),
    setSize: (size: { width?: number, height?: number, isMobile: boolean }) => set({ size }),
}));

if (typeof (window) != "undefined") {
    let timeout: NodeJS.Timeout;

    window.addEventListener("resize", function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            useVanoraStore.getState().setSize({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth <= 900
            });
        }, 250);
    });
}

export default useVanoraStore;