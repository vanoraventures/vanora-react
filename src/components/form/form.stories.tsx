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
    const [render, setRender] = useState(0);
    const [test, setTest] = useState<any[]>([{ Id: 0, Value: "0" }]);

    useEffect(() => {
        setTimeout(() => {
            setTest([{ Id: 33, Value: "33" }]);
        }, 300);

        // setTimeout(() => {
        //     setRender(1);
        // }, 5000);
    }, []);

    return <>
        <Form form={form} onSubmit={async (model: FormType) => console.log(model.getAll())}>
            <>
                {test.map((item, index) =>
                    <>
                        <InputText key={"test" + item.Id} name={"name-" + index.toString()} value={item.Value}></InputText>
                        {true &&
                            <button type="button" onClick={async () => {
                                setTest(prev => {
                                    return prev.filter((x, i) => index != i);
                                });
                            }}>Çıkar</button>
                        }
                    </>
                )}
            </>
            <br></br>
            <button>Submit</button>
        </Form>

        <button onClick={async () => {
            setTest(prev => {
                return [...prev, { Id: 0, Value: "0" }]
            });
        }}>Ekle</button>
    </>
};

export const Sample = Template.bind({});
Sample.args = {
    classNames: "Test"
};