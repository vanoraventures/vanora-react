import useVanoraStore from "./core";

/**
 * Returns an object { width: number | undefined; height: number | undefined; isMobile: boolean; }
 */
function useWindowSize() {
    return useVanoraStore(state => state.size);
}

export default useWindowSize;