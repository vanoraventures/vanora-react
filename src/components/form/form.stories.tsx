import React, { useEffect, useState } from "react";
import { Story } from "@storybook/react";
import Form, { useForm, FormType } from ".";
import InputText from "./items/input-text";
import Checkbox from "./items/checkbox";
import Recaptcha from "./items/recaptcha";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();

    return <>
        <Recaptcha siteKey="6Lcv1HkoAAAAAPrWnLBgdKGa2UHOiZk5jNDThH3I" />
        <Form form={form} onSubmit={async (model: FormType) => {
            console.log(await model.getAllJson());
        }}>
            <Checkbox name="test" value={true}></Checkbox>
            <button>Submit</button>
        </Form>

        <button onClick={async () => { console.log(await form.getRecaptchaToken()); }}>Temizle</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};