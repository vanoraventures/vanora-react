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
import Dropdown from "./items/dropdown"; // 🔥 Import your Dropdown component
import { Validate } from "./models/validations";
import { Permit } from "./models/permissions";

export default {
    title: "Vanora-react/form",
    component: Form,
};

const Template: Story = (args) => {
    const form = useForm();
    const [test, setTest] = useState(new Date("2024/04/16"));

    useEffect(() => {
        setTimeout(() => {
            setTest(new Date("2024/04/25"));
        }, 2000);
    }, []);

    return <>
        <Form form={form} onSubmit={async (model: FormType) => {
            console.log("Submitted model:", model.getAll());
        }}>
            {/* Example Date Input */}
            <InputDate
                name="test"
                value={test.toString()}
                permissions={[
                    Permit.Custom(e => {
                        if (e.key == "-" || e.key == ".") {
                            e.preventDefault();
                            return false;
                        }
                        return true;
                    })
                ]}
                customization={{ enableManualTyping: true }}
                onKeyPress={e => {
                    const item = e.target as HTMLInputElement;
                    if (item.value.length === 2 || item.value.length === 5) {
                        form.setVal("BirthDate", item.value + "/");
                    }
                }}
            />
            <br />

            {/* 🔹 Single-Select Dropdown */}
            <Dropdown
                name="singleSelect"
                label="Favorite Framework"
                placeholder="Choose one"
                options={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" },
                    { value: "svelte", label: "Svelte" }
                ]}
                onChange={(val) => console.log("Single select changed:", val)}
            />
            <br />

            {/* 🔸 Multi-Select Dropdown */}
            <Dropdown
                name="multiSelect"
                label="Technologies Known"
                placeholder="Select multiple"
                isMultiple
                isClearable
                options={[
                    { value: "js", label: "JavaScript" },
                    { value: "ts", label: "TypeScript" },
                    { value: "scss", label: "SCSS" },
                    { value: "vite", label: "Vite" }
                ]}
                onChange={(val) => console.log("Multi select changed:", val)}
            />
            <br />

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
