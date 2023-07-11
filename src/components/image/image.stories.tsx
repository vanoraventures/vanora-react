import React from "react";
import { Story } from "@storybook/react";
import Vanora from "../main";
import Image, { ImageProps } from ".";

export default {
    title: "Vanora-react/image",
    component: Image,
};

const Template: Story<ImageProps> = (args: ImageProps) =>
    <Vanora>
        <Image {...args} />
    </Vanora>;

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    desktop: "desktop",
    mobile: "mobile",
    alt: ""
};