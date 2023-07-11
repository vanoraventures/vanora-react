import { useVanoraStore } from ".";

/**
 * Returns two functions [lockScroll, unlockScroll]
 */
function useLockScroll(): [() => void, () => void] {
    const scroll = useVanoraStore(state => state.scroll);
    const setScroll = useVanoraStore(state => state.setScroll);

    const lockScroll = () => {
        if (typeof (window) != "undefined") {
            const count = scroll.lockedScrollCount;
            scroll.lockedScrollCount = count + 1;

            if (count === 0) {
                scroll.lastScrollPosition = document.documentElement.scrollTop;

                document.body.style.marginTop = document.documentElement.scrollTop * (-1) + "px";
                document.body.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + "px";
                document.documentElement.classList.add("lock");
            }

            setScroll({ ...scroll });
        }
    }

    const unlockScroll = () => {
        if (typeof (window) != "undefined") {
            const count = scroll.lockedScrollCount;
            scroll.lockedScrollCount = Math.max(count - 1, 0);

            if (count === 1) {
                document.documentElement.classList.remove("lock");
                document.body.style.paddingRight = "";
                document.body.style.marginTop = "";
                window.scrollTo(0, scroll.lastScrollPosition);
            }

            setScroll({ ...scroll });
        }
    }

    return [lockScroll, unlockScroll];
}

export default useLockScroll;