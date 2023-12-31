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

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();
    const [test, setTest] = useState<string | undefined>();

    useEffect(() => {
        setTimeout(() => {
            setTest("2023-12-06T00:00:00");
        }, 3000);
    }, []);

    return <>
        {/* <Recaptcha siteKey="6Lcv1HkoAAAAAPrWnLBgdKGa2UHOiZk5jNDThH3I" /> */}
        <Form form={form} onSubmit={async (model: FormType) => {
            for (var pair of (await model.getFormData() as any).entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            // console.log(await model.getFormData());
        }}>
            {/* <Radio value={test} name="asd" options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" }
            ]}></Radio> */}
            <InputDate name="date" value={test} customization={{ format: "dd/MM/yyyy", showYearDropdown: true }}></InputDate>
            <InputHidden name="id" value="10"></InputHidden>
            {/* <FileUpload name="files" multiple={true}></FileUpload>
            <Checkbox name="test" value={true}></Checkbox> */}
            <button>Submit</button>
        </Form>

        <button onClick={async () => { console.log(await form.getAllJson()); }}>Temizle</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};