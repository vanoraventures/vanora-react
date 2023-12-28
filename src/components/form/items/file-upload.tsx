import React, { useContext, useEffect } from "react";
import { FormContext, FormItemProps, FormItemType, FormKeyEvents, FormMouseEvents } from "..";
import { validateFormItem } from "../models/validations";
import ErrorMessage from './errorMessage';

type FileUploadProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    isDisabled?: boolean,
    label?: string,
    allowedTypes?: string,
    multiple?: boolean
}

const FileUpload = (props: FileUploadProps) => {
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
                type: props.multiple ? FormItemType.MultipleFile : FormItemType.File,
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

    useEffect(() => {
        if (item) {
            item.value = props.value ?? "";
            context.setModel([...context.model]);
        }
    }, [props.value]);

    const handleChange = (input: EventTarget & HTMLInputElement) => {
        if (item) {
            if (input) {
                if (input.files && input.files.length > 0) {
                    if (props.multiple) {
                        item.data = input.files;
                    }
                    else {
                        item.data = input.files[0];
                    }
                }
                else {
                    item.data = "";
                }
            }

            item.value = input.value;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);

            if (props.onChange) {
                props.onChange(input.value);
            }
        }
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <input
                type="file"
                name={props.name}
                value={item?.value}
                multiple={props.multiple}
                tabIndex={props.tabIndex}
                autoComplete={props.autoComplete}
                onChange={(e) => handleChange(e.currentTarget)}
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