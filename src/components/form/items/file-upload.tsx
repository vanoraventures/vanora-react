import React, { useContext, useEffect, useRef } from "react";
import { FormContext, FormItemProps, FormKeyEvents, FormMouseEvents } from "..";
import { validateFormItem } from "../models/validations";
import ErrorMessage from './errorMessage';

type FileUploadProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    isDisabled?: boolean,
    label?: string,
    allowedTypes?: string
}

const FileUpload = (props: FileUploadProps) => {
    const context = useContext(FormContext);
    const item = context.model.find(x => x.name === props.name);
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (context.model.some(x => x.name === props.name)) {
            throw new Error("Development error ---> Each form element must have unique name!");
        }

        context.setModel(model => {
            model.push({
                name: props.name,
                value: props.value ?? "",
                validations: props.validations,
                isValid: (props.validations ? props.isValid : true),
                data: ""
            });

            return [...model];
        });

        return () => {
            context.setModel(model => [...model.filter(x => x.name !== props.name)]);
        }
    }, []);

    const handleChange = (value: string) => {
        if (item) {
            if (input && input.current) {
                if (input.current.files && input.current.files.length > 0) {
                    item.data = input.current.files[0];
                }
                else {
                    item.data = "";
                }
            }

            item.value = value;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);

            if (props.onChange) {
                props.onChange(value);
            }
        }
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <input
                ref={input}
                type="file"
                name={props.name}
                defaultValue={props.value}
                onChange={(e) => handleChange(e.currentTarget.value)}
                onKeyPress={props.onKeyPress}
                onKeyDown={props.onKeyDown}
                onKeyUp={props.onKeyUp}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onMouseMove={props.onMouseMove}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                {...(props.isDisabled ? { disabled: true } : {})}
                {...(props.allowedTypes ? { accept: props.allowedTypes } : {})}
            />
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default FileUpload;