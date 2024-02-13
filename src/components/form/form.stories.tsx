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
    const [data, setData] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setData("123");
        }, 1000);
    }, []);

    return <>
        <Form form={form} onSubmit={async (model: FormType) => console.log(model.getAll())}>
            <InputText name={"name"} validations={[Validate.Required()]} value={data}></InputText>
            <br></br>
            <button>Submit</button>
        </Form>

        <button onClick={() => {
            form.clear();
            setData("123");
            form.refresh();
        }}>Test</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};