import React from "react";
import "./loading.scss";
import { useVanoraStore } from "../../core";

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

export default Loading;