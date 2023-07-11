import React from "react";
import { Story } from "@storybook/react";
import Tabs, { TabContainer, TabItem, TabMenu, TabMenuItem } from ".";

export default {
    title: "Vanora-react/tabs",
    component: Tabs,
};

const Template: Story = (args) =>
    <Tabs {...args} onChange={(index) => { console.log("current-index: " + index) }}>
        <TabMenu onClick={() => { console.log("tab-menu click") }}>
            <TabMenuItem key={"tab-menu-1"} onClick={() => { console.log("tab-menu-item-1 click") }}>
                Tab 1
            </TabMenuItem>
            <TabMenuItem key={"tab-menu-2"}>
                Tab 2
            </TabMenuItem>
        </TabMenu>
        <TabContainer>
            <TabItem key={"tab-item-1"}>
                Tab Item 1
            </TabItem>
            <TabItem key={"tab-item-2"}>
                Tab Item 2
            </TabItem>
        </TabContainer>
    </Tabs>

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    startIndex: 0
};