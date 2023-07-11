import React from "react";
import { Story } from "@storybook/react";
import Vanora from "../main";
import Portal, { PortalProps } from ".";

export default {
    title: "Vanora-react/portal",
    component: Portal,
};

const Template: Story<PortalProps> = (args: PortalProps) =>
    <Vanora>
        <Portal {...args}>
            <div>test</div>
            <div>test2</div>
        </Portal>
    </Vanora>;

export const Sample = Template.bind({});
Sample.args = {
    targetSelector: "body"
};