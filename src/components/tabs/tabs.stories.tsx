import React, { useEffect } from "react";
import { Story } from "@storybook/react";
import Tabs, { TabContainer, TabItem, TabMenu, TabMenuItem, useTabs } from ".";

export default {
    title: "Vanora-react/tabs",
    component: Tabs,
};

const Template: Story = (args) => {
    const tabs = useTabs();

    return <>
        <Tabs {...args} tabs={tabs} onChange={(index) => { console.log("current-index: " + index) }}>
            <TabMenu>
                <TabMenuItem key={"tab-menu-1"}>
                    Tab 1
                </TabMenuItem>
                <TabMenuItem key={"tab-menu-2"}>
                    Tab 2
                </TabMenuItem>
                <TabMenuItem key={"tab-menu-all"} openAll={true}>
                    ALL
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
        <button onClick={() => { tabs.openAll() }}>TÜMÜ</button>
    </>
}

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    startIndex: 0
};