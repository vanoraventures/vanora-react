import React, { useEffect, useState } from "react";
import { Story } from "@storybook/react";
import Vanora from "../main";
import Form, { FormItem, useForm, FormType } from ".";
import { Validate } from './models/validations';
import InputText from "./items/input-text";
import Checkbox from "./items/checkbox";
import InputPassword from "./items/input-password";
import Radio from "./items/radio";
import FileUpload from "./items/file-upload";
import { Permit } from "./models/permissions";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();

    return <Vanora>
        <>
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
    </Vanora>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};