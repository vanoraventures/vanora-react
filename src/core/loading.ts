import useVanoraStore from "./core";

/**
 * Returns two functions [decreaseLoading, increaseLoading]
 */
function useLoading(): [() => void, () => void] {
    return [useVanoraStore(state => state.decreaseLoading), useVanoraStore(state => state.increaseLoading)];
}

export default useLoading;