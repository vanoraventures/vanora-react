import React, { useContext, useEffect, useRef } from 'react';
import { FormContext, FormItemProps, FormKeyEvents, FormMouseEvents } from '..';
import { permitKey, Permission } from '../models/permissions';
import { validateFormItem } from '../models/validations';
import ErrorMessage from './errorMessage';

type InputSplitProps = FormItemProps & FormKeyEvents & FormMouseEvents & {
    charCount: number,
    isDisabled?: boolean,
    label?: string,
    permissions?: Permission[]
}

const InputSplit = (props: InputSplitProps) => {
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
                validations: props.validations,
                permissions: props.permissions,
                isValid: (props.validations ? props.isValid : true)
            });

            return [...model];
        });

        return () => {
            context.setModel(model => [...model.filter(x => x.name !== props.name)]);
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputs = event.currentTarget.parentElement?.querySelectorAll("input");
        let currentValue = "";
        
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                currentValue += inputs[i].value;
            }
        }

        if (event.currentTarget.value) {
            const next = event.currentTarget.nextElementSibling as HTMLInputElement;
            if (next) {
                next.focus();
            }
        }

        if (item) {
            item.value = currentValue;
            validateFormItem(item, context.model);

            context.setModel([...context.model]);
        }

        if (props.onChange) {
            props.onChange(currentValue);
        }
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowLeft") {
            const prev = event.currentTarget.previousElementSibling as HTMLInputElement;
            if (prev) {
                prev.focus();
                prev.selectionStart = 1;
                prev.selectionEnd = 1;
                event.preventDefault();
            }
        }
        else if (event.key === "ArrowRight") {
            const next = event.currentTarget.nextElementSibling as HTMLInputElement;
            if (next) {
                next.focus();
                next.selectionStart = 1;
                next.selectionEnd = 1;
                event.preventDefault();
            }
        }
        else if (event.key === "Backspace") {
            const prev = event.currentTarget.previousElementSibling as HTMLInputElement;
            if (event.currentTarget.value === "" && prev) {
                prev.focus();
                prev.selectionStart = 1;
                prev.selectionEnd = 1;
            }
        }
    }

    let items = [];
    for (let i = 0; i < props.charCount; i++) {
        items.push(<input
            maxLength={1}
            type="text"
            value={item?.value.substr(i, 1) ?? ""}
            onChange={(e) => handleChange(e)} key={"input-split-" + i}
            onKeyPress={(e) => { permitKey(e, item); if (props.onKeyPress) { props.onKeyPress(e); } }}
            onKeyDown={(e) => { onKeyDown(e); if (props.onKeyDown) { props.onKeyDown(e); } }}
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
        />);
    }

    return (
        <div className={"form-item" + ((item?.value ?? "".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <div className="split-container">
                {items}
            </div>
            {props.children}
            <ErrorMessage rules={item?.validations} />
        </div>
    )
}

export default InputSplit;