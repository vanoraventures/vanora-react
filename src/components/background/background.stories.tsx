import React from "react";
import { Story } from "@storybook/react";
import Vanora from "../main";
import Background, { BackgroundProps } from ".";

export default {
    title: "Vanora-react/background",
    component: Background,
};

const Template: Story<BackgroundProps> = (args: BackgroundProps) =>
    <Vanora>
        <Background {...args}>
            Sample
        </Background>
    </Vanora>;

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    desktop: "desktop",
    mobile: "mobile",
    isSection: true
};