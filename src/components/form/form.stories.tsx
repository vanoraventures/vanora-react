import React, { useEffect, useState } from "react";
import { Story } from "@storybook/react";
import Form, { useForm, FormType } from ".";
import InputText from "./items/input-text";
import Checkbox from "./items/checkbox";
import Recaptcha from "./items/recaptcha";
import FileUpload from "./items/file-upload";
import Radio from "./items/radio";
import InputDate from "./items/input-date";
import InputHidden from "./items/input-hidden";
import { Validate } from "./models/validations";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();

    return <>
        <Form form={form} onSubmit={async (model: FormType) => console.log("test", model.getAll())}>
            <InputText name={"name1"} validations={[Validate.OptionalRequired(["name1", "name2", "name3"])]}></InputText>
            <InputText name={"name2"} validations={[Validate.OptionalRequired(["name1", "name2", "name3"])]}></InputText>
            <InputText name={"name3"} validations={[Validate.OptionalRequired(["name1", "name2", "name3"])]}></InputText>
            <br></br>
            <button>Submit</button>
        </Form>

        <button onClick={() => {
            form.clear();
            form.refresh();
        }}>Test</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};