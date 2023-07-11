import React from "react";
import { Story } from "@storybook/react";
import Form, { useForm, FormType } from ".";
import { Validate } from './models/validations';
import InputText from "./items/input-text";
import FileUpload from "./items/file-upload";
import { Permit } from "./models/permissions";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();

    return <>
        <Form form={form} onSubmit={(model: FormType) => {
            console.log(model.getAllJson());
        }}>
            {() => {
                return <>
                    <InputText name='fullname'
                        permissions={[
                            Permit.MaxLength(11),
                            Permit.OnlyNumber()
                        ]}
                        validations={[Validate.Tckn("HATATATA")]}
                    ></InputText>
                    <FileUpload name="file"></FileUpload>
                    <button>Submit</button>
                </>
            }}
        </Form>

        <button onClick={() => { form.clear(); }}>Change</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};