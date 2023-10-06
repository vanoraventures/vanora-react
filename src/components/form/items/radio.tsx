import React, { useContext, useEffect } from 'react';
import { FormContext, FormItemProps, FormItemType, FormMouseEvents } from '..';
import { validateFormItem } from '../models/validations';
import ErrorMessage from './errorMessage';

type RadioProps = FormItemProps & FormMouseEvents & {
    options: {
        value: string,
        label: JSX.Element | JSX.Element[] | string,
        isDisabled?: boolean
    }[]
}

const Radio = (props: RadioProps) => {
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
                type: FormItemType.Radio,
                validations: props.validations,
                isValid: (props.validations ? props.isValid : true)
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

    const handleChange = (value: any) => {
        if (item) {
            item.value = value;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);
        }

        if (props.onChange) {
            props.onChange(value);
        }
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.options.map((radio, index) => (
                <div className="radio-item" key={"radio-" + index}>
                    <input
                        type="radio"
                        id={props.name + "-" + index}
                        name={props.name}
                        defaultValue={radio.value}
                        checked={radio.value === item?.value}
                        onChange={(e) => { handleChange(e.target.value) }}
                        onFocus={props.onFocus}
                        onBlur={props.onBlur}
                        onClick={props.onClick}
                        onMouseDown={props.onMouseDown}
                        onMouseUp={props.onMouseUp}
                        onMouseMove={props.onMouseMove}
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                        {...(radio.isDisabled ? { disabled: true } : {})}
                    />
                    <label htmlFor={props.name + "-" + index}>{radio.label}</label>
                </div>
            ))}
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default Radio;