import React from "react";
import { Story } from "@storybook/react";
import Popup, { PopupProps, usePopup } from ".";

export default {
    title: "Vanora-react/popup",
    component: Popup,
};

const Template: Story<PopupProps> = (args: PopupProps) => {
    const popup = usePopup();

    return <>
        <button onClick={() => popup.open()}>Open</button>
        <Popup popup={popup} onOpen={() => { console.log("opened") }} onClose={() => { console.log("closed") }}>
            <div className="popup-container">
                <div className="content">
                    Test
                </div>
                <div className="popup-close" onClick={() => popup.close()}></div>
            </div>
        </Popup>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: ""
};