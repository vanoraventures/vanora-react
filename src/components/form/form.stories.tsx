import React, { useEffect, useState } from "react";
import { StoryFn } from "@storybook/react";
import Form, { useForm, FormType } from ".";
import InputText from "./items/input-text";
import Checkbox from "./items/checkbox";
import Recaptcha from "./items/recaptcha";
import FileUpload from "./items/file-upload";
import Radio from "./items/radio";
import InputDate from "./items/input-date";
import InputHidden from "./items/input-hidden";
import { Validate } from "./models/validations";
import { Permit } from "./models/permissions";
import InputEmail from "./items/input-email";
import Loading from "../loading";
import { useLockScroll } from "../../core";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: StoryFn = (args) => {
    const [lockScroll, unlockScroll] = useLockScroll();
    const form = useForm();
    const [test, setTest] = useState(new Date("2024/04/16"));

    useEffect(() => {
        setTimeout(() => {
            setTest(new Date("2024/04/25"));
        }, 2000);
    }, []);

    return <>
        <Loading />
        <Form form={form} onSubmit={async (model: FormType) => console.log("test", model.getAll())}>
            {/* <InputDate name="test" value={test.toString()} permissions={[Permit.Custom(e => {
                if (e.key == "-" || e.key == ".") {
                    e.preventDefault();
                    return false;
                }
                return true;
            })]} customization={{ enableManualTyping: true }} onKeyPress={e => {
                const item = e.target as HTMLInputElement;

                if (item.value.length == 2) {
                    form.setVal("BirthDate", item.value + "/");
                }
                else if (item.value.length == 5) {
                    form.setVal("BirthDate", item.value + "/");
                }
            }}></InputDate> */}
            <InputText
                name={"Test"}
            />
            <InputEmail
                name={"Test2"}
            />
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