import React, { useContext, useEffect } from 'react';
import { FormContext, FormItemProps, FormItemType } from '..';

const InputHidden = (props: FormItemProps) => {
    const context = useContext(FormContext);
    const item = context.model.find(x => x.name === props.name);

    useEffect(() => {
        if (context.model.some(x => x.name === props.name)) {
            throw new Error("Development error ---> Each form element must have unique name!");
        }

        context.setModel(model => {
            model.push({
                name: props.name,
                value: props.value ?? "",
                type: FormItemType.Input,
                isValid: true
            });

            return [...model];
        });

        return () => {
            context.setModel(model => [...model.filter(x => x.name !== props.name)]);
        }
    }, []);

    useEffect(() => {
        if (item) {
            item.value = props.value ?? "";
            context.setModel([...context.model]);
        }
    }, [props.value]);

    return (
        <input type='hidden' name={props.name} value={item?.value ?? ""}></input>
    )
}

export default InputHidden;