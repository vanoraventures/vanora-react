import React from "react";
import { StoryFn } from "@storybook/react";
import Portal, { PortalProps } from ".";

export default {
    title: "Vanora-react/portal",
    component: Portal,
};

const Template: StoryFn<PortalProps> = (args: PortalProps) =>
    <Portal {...args}>
        <div>test</div>
        <div>test2</div>
    </Portal>

export const Sample = Template.bind({});
Sample.args = {
    targetSelector: "body"
};