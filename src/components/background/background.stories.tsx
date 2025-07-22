import React from "react";
import { StoryFn } from "@storybook/react";
import Background, { BackgroundProps } from ".";

export default {
    title: "Vanora-react/background",
    component: Background,
};

const Template: StoryFn<BackgroundProps> = (args: BackgroundProps) =>
    <Background {...args}>
        Sample
    </Background>

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    desktop: "desktop",
    mobile: "mobile",
    isSection: true
};