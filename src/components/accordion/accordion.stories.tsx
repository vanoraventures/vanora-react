import React from "react";
import { Story } from "@storybook/react";
import { AccordionBody, AccordionHeader, AccordionItem, useAccordion } from ".";
import Accordion from ".";

export default {
    title: "Vanora-react/accordion",
    component: Accordion,
};

const Template: Story = (args) => {
    const accordion = useAccordion();

    return <>
        <Accordion {...args} accordion={accordion}>
            <AccordionItem onOpen={() => { console.log("open") }} onClose={() => { console.log("close") }}>
                <AccordionHeader>
                    Header
                </AccordionHeader>
                <AccordionBody>
                    Body
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader>
                    Header1
                </AccordionHeader>
                <AccordionBody>
                    Body1
                </AccordionBody>
            </AccordionItem>
        </Accordion>
        <button onClick={() => { accordion.close(0) }}>test</button>
    </>
}

export const Sample = Template.bind({});
Sample.args = {
    classNames: "",
    closeOthersOnOpen: false
};